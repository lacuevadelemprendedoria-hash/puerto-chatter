

## Reset Admin Credentials

Since we cannot directly create users in the authentication system or modify auth tables via SQL, here's the plan:

### Step 1: Enable auto-confirm for email signups
Temporarily allow signups without email verification so you can create the account instantly.

### Step 2: Create a database trigger for auto-admin
Add a temporary trigger that automatically inserts into `admin_users` when a new user signs up with email `admin@puertonest.com`.

```sql
CREATE OR REPLACE FUNCTION public.auto_admin_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.email = 'admin@puertonest.com' THEN
    INSERT INTO public.admin_users (user_id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_admin_on_signup();
```

**Wait** — triggers on `auth.users` are not allowed in Lovable Cloud (reserved schema).

### Revised approach

1. **Enable auto-confirm** temporarily
2. **You sign up** at `/admin` with email `admin@puertonest.com` and password `PuertoNest2025!`
3. **I insert** the new user into `admin_users` using a migration with a subquery:
   ```sql
   INSERT INTO admin_users (user_id, email)
   SELECT id, email FROM auth.users WHERE email = 'admin@puertonest.com'
   ON CONFLICT DO NOTHING;
   ```
   (This also won't work — migrations can't read `auth.users` directly.)

### Final practical approach

1. **Enable auto-confirm** for email signups (I'll do this via the auth config tool)
2. **You go to `/admin`**, click "Sign Up", enter `admin@puertonest.com` / `PuertoNest2025!`
3. The signup toast will show your `user_id` and copy it to clipboard
4. **Paste that user_id back to me** in chat, and I'll run a migration to insert it into `admin_users`
5. **You log in** with those credentials
6. I disable auto-confirm afterward

### Files changed
- No code changes needed — only backend configuration and one database migration

