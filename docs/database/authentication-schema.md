# Database Schema - Authentication System

## Overview

Complete database schema for authentication system built on Supabase Auth with multi-tenancy support.

---

## Supabase Auth Built-in Tables

Supabase provides these tables in the `auth` schema:

| Table | Description |
|-------|-------------|
| `auth.users` | Core user data (email, encrypted_password, email_confirmed_at, etc.) |
| `auth.identities` | User identities linked to providers |
| `auth.sessions` | Active user sessions |
| `auth.refresh_tokens` | Refresh tokens for session renewal |

---

## Custom Tables

### 1. `public.profiles`

Extended user profile data linked to `auth.users`.

```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Features:**
- Automatic profile creation on user signup via trigger
- Auto-updating `updated_at` timestamp
- RLS policies for user data isolation
- Helper function `get_profile_by_id(user_id)`

### 2. `public.organizations`

Multi-tenant organizations for SaaS functionality.

```sql
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    plan TEXT NOT NULL DEFAULT 'free', -- free, pro, enterprise
    max_users INTEGER NOT NULL DEFAULT 1,
    max_products INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Features:**
- Subscription plan support (free/pro/enterprise)
- Limits on users and products per plan
- Unique slug for organization URLs
- RLS policies based on membership

### 3. `public.organization_members`

Junction table for user-organization relationships.

```sql
CREATE TABLE public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member', -- owner, admin, member
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);
```

**Features:**
- Role-based access (owner, admin, member)
- One user can belong to multiple organizations
- RLS policies for role-based permissions

---

## Row Level Security (RLS)

### Profiles Table

| Policy | Description |
|--------|-------------|
| `Users can view own profile` | Users can SELECT their own profile |
| `Users can update own profile` | Users can UPDATE their own profile |
| `Users can insert own profile` | Allows trigger to create profile |

### Organizations Table

| Policy | Description |
|--------|-------------|
| `Users can view their organizations` | Members can view their organizations |
| `Owners and admins can update organization` | Only owners/admins can update org details |

### Organization Members Table

| Policy | Description |
|--------|-------------|
| `Users can view their organization memberships` | Users can see their memberships |
| `Owners and admins can view all members` | Owners/admins can see all members |
| `Owners and admins can add members` | Only owners/admins can add users |
| `Owners and admins can update members` | Only owners/admins can change roles |
| `Owners and admins can remove members` | Only owners/admins can remove users |

---

## Triggers

| Trigger | Table | Description |
|---------|-------|-------------|
| `profiles_updated_at` | profiles | Auto-update updated_at on row update |
| `organizations_updated_at` | organizations | Auto-update updated_at |
| `organization_members_updated_at` | organization_members | Auto-update updated_at |
| `on_auth_user_created` | auth.users | Auto-create profile on signup |

---

## Helper Functions

### `handle_new_user()`

Automatically creates a profile when a new user signs up via Supabase Auth.

```sql
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### `create_personal_organization(user_id, user_email)`

Creates a personal organization for a new user and adds them as owner.

### `get_user_organization(user_id)`

Returns the user's default organization (first created).

### `get_profile_by_id(user_id)`

Returns a user's profile data.

---

## Indexes

| Index | Table | Columns |
|-------|-------|---------|
| `profiles_email_idx` | profiles | email |
| `profiles_full_name_idx` | profiles | full_name |
| `organizations_slug_idx` | organizations | slug |
| `organizations_plan_idx` | organizations | plan |
| `org_members_org_idx` | organization_members | organization_id |
| `org_members_user_idx` | organization_members | user_id |
| `org_members_role_idx` | organization_members | role |

---

## Migration Files

| File | Description |
|------|-------------|
| `20260324000001_create_profiles.sql` | Creates profiles table with RLS |
| `20260324000002_create_organizations.sql` | Creates organizations and organization_members with RLS |

---

## Security Considerations

1. **RLS Enabled**: All tables have Row Level Security enabled
2. **Security Definer**: Helper functions use `SECURITY DEFINER` for proper permissions
3. **Cascade Delete**: Proper foreign key constraints with `ON DELETE CASCADE`
4. **Unique Constraints**: Email and slug uniqueness enforced at database level
5. **Check Constraints**: Role and plan values validated

---

## Next Steps (Backend Developer)

1. Implement authentication services in TypeScript
2. Create Supabase client configuration
3. Implement password validation
4. Handle Supabase errors with user-friendly messages
5. Create Server Actions for auth operations
