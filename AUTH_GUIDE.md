# MIRA Authentication Guide

Follow these steps to set up your authentication system and manage user roles.

## 1. Google OAuth Setup
To enable Google Login, you need to configure your credentials:

1.  **Google Cloud Console**: Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  **Project**: Create or select a project.
3.  **Consent Screen**: Configure the "OAuth consent screen" (Internal or External).
4.  **Credentials**: 
    - Go to "Credentials" > "Create Credentials" > "OAuth client ID".
    - Select **Web application**.
    - Add **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
5.  **Environment Variables**: Copy the Client ID and Client Secret into your `.env` file:
    ```env
    GOOGLE_CLIENT_ID="your_client_id_here"
    GOOGLE_CLIENT_SECRET="your_client_secret_here"
    NEXTAUTH_SECRET="a_random_string_for_security"
    NEXTAUTH_URL="http://localhost:3000"
    ```

## 2. Admin Access
By default, every new user is assigned the `USER` role. To become an **ADMIN**:

1.  **Log in**: Sign in to the application via the "Sign In" button in the Navbar.
2.  **Database Update**: 
    - Open your Supabase Dashboard or use [Prisma Studio](https://www.prisma.io/studio) (`npx prisma studio`).
    - Find your user record in the `User` table.
    - Change the `role` field from `USER` to `ADMIN`.
3.  **Refresh**: Log out and log back in (or refresh the page). You will now see the "ADMIN" link in your account menu.

## 3. Regular User Access
Regular users simply click "Sign In" in the navbar. Their account will be automatically created in the database upon their first successful Google login.
