-- ============================================================================
-- Migration: Create Organizations and Organization Members
-- Description: Multi-tenancy support for SaaS application
-- Author: Database Architect (Multi-Agent Workflow)
-- Date: 2026-03-24
-- ============================================================================

-- Create organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    logo_url TEXT,
    plan TEXT NOT NULL DEFAULT 'free', -- free, pro, enterprise
    max_users INTEGER NOT NULL DEFAULT 1,
    max_products INTEGER NOT NULL DEFAULT 100,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT organizations_slug_key UNIQUE(slug),
    CONSTRAINT organizations_plan_check CHECK (plan IN ('free', 'pro', 'enterprise'))
);

-- Create organization_members table for user-organization relationships
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT org_members_org_user_unique UNIQUE(organization_id, user_id),
    CONSTRAINT org_members_role_check CHECK (role IN ('owner', 'admin', 'member'))
);

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS org_members_org_idx ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS org_members_user_idx ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS org_members_role_idx ON public.organization_members(role);
CREATE INDEX IF NOT EXISTS organizations_slug_idx ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS organizations_plan_idx ON public.organizations(plan);

-- Trigger for organizations updated_at
CREATE TRIGGER organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for organization_members updated_at
CREATE TRIGGER organization_members_updated_at
    BEFORE UPDATE ON public.organization_members
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view organizations they are members of
CREATE POLICY "Users can view their organizations"
    ON public.organizations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = organizations.id
            AND user_id = auth.uid()
        )
    );

-- Policy: Organization owners/admins can update organization
CREATE POLICY "Owners and admins can update organization"
    ON public.organizations
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = organizations.id
            AND user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );

-- Enable RLS on organization_members
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view organization memberships
CREATE POLICY "Users can view their organization memberships"
    ON public.organization_members
    FOR SELECT
    USING (user_id = auth.uid());

-- Policy: Organization owners/admins can view all members
CREATE POLICY "Owners and admins can view all members"
    ON public.organization_members
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.organization_members om
            WHERE om.organization_id = organization_members.organization_id
            AND om.user_id = auth.uid()
            AND om.role IN ('owner', 'admin')
        )
    );

-- Policy: Organization owners/admins can insert members
CREATE POLICY "Owners and admins can add members"
    ON public.organization_members
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = organization_members.organization_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );

-- Policy: Organization owners/admins can update member roles
CREATE POLICY "Owners and admins can update members"
    ON public.organization_members
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = organization_members.organization_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );

-- Policy: Organization owners/admins can remove members
CREATE POLICY "Owners and admins can remove members"
    ON public.organization_members
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_id = organization_members.organization_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );

-- ============================================================================
-- Helper Functions
-- ============================================================================

-- Function to create a personal organization for new users
CREATE OR REPLACE FUNCTION public.create_personal_organization(user_id UUID, user_email TEXT)
RETURNS UUID AS $$
DECLARE
    org_id UUID;
    org_slug TEXT;
BEGIN
    -- Generate unique slug from email
    org_slug := LOWER(REGEXP_REPLACE(user_email, '@.*', '')) || '-' || substr(gen_random_uuid()::text, 1, 8);

    -- Create organization
    INSERT INTO public.organizations (name, slug)
    VALUES (split_part(user_email, '@', 1), org_slug)
    RETURNING id INTO org_id;

    -- Add user as owner
    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (org_id, user_id, 'owner');

    RETURN org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's default organization
CREATE OR REPLACE FUNCTION public.get_user_organization(user_id UUID)
RETURNS TABLE (
    organization_id UUID,
    organization_name TEXT,
    organization_slug TEXT,
    role TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        o.id AS organization_id,
        o.name AS organization_name,
        o.slug AS organization_slug,
        om.role
    FROM public.organizations o
    INNER JOIN public.organization_members om ON o.id = om.organization_id
    WHERE om.user_id = user_id
    ORDER BY om.created_at ASC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.create_personal_organization(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_organization(UUID) TO authenticated;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE public.organizations IS 'Organizations for multi-tenant SaaS';
COMMENT ON TABLE public.organization_members IS 'Junction table for user-organization relationships';
COMMENT ON COLUMN public.organizations.plan IS 'Subscription plan: free, pro, or enterprise';
COMMENT ON COLUMN public.organization_members.role IS 'User role in organization: owner, admin, or member';
