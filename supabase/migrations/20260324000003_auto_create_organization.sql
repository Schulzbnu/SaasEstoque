-- ============================================================================
-- Migration: Auto-create Organization on User Signup
-- Description: Updates trigger to automatically create personal organization
-- Author: Database Architect (Multi-Agent Workflow)
-- Date: 2026-03-24
-- ============================================================================

-- Drop old trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Updated function to create profile AND organization
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    org_id UUID;
    org_slug TEXT;
BEGIN
    -- Insert profile
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );

    -- Generate unique slug from email
    org_slug := LOWER(REGEXP_REPLACE(NEW.email, '@.*', '')) || '-' || substr(gen_random_uuid()::text, 1, 8);

    -- Create personal organization
    INSERT INTO public.organizations (name, slug)
    VALUES (split_part(NEW.email, '@', 1), org_slug)
    RETURNING id INTO org_id;

    -- Add user as organization owner
    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (org_id, NEW.id, 'owner');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates profile, organization, and ownership on user signup';
