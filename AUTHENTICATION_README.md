# KM Silage - Authentication & Protected Routes Guide

## Overview

This document explains the authentication system implemented in the KM Silage application. The system ensures that:

- **Unauthenticated users always see the login page first**
- **Logged-in users cannot access the login page**
- **Protected routes require authentication**

---

## Architecture

### 1. **Middleware Protection** (`middleware.ts`)

The middleware acts as a gatekeeper for all routes in the application.

**Location:** `middleware.ts` (root of project)

**How it works:**

```typescript
- Checks every incoming request for a valid authentication token
- Public routes (auth routes and API routes) are allowed without authentication
- All other routes require a valid NextAuth JWT token
- If no token exists, user is redirected to /auth/login
```

**Routes Handled:**

- ✅ **Public (No auth required):** `/auth/*`, `/api/*`
- 🔒 **Protected (Auth required):** `/`, `/admin/*`, and any other route

**Matcher Config:**

```typescript
matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"];
```

This pattern protects all routes except Next.js internals and static assets.

---

### 2. **Login Page Logic** (`app/auth/login/page.tsx`)

The login page has built-in authentication checks to prevent logged-in users from accessing it.

**Key Features:**

#### a) **useSession Hook**

```typescript
const { data: session, status } = useSession();
```

- `status` values: `"loading"`, `"authenticated"`, `"unauthenticated"`
- `session` contains user data including role

#### b) **Auto-Redirect Effect**

```typescript
useEffect(() => {
  if (status === "authenticated" && session) {
    if (session?.user?.role === "admin") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/");
    }
  }
}, [session, status, router]);
```

**What it does:**

- Runs when component mounts or session/status changes
- If user is logged in, redirects them away from login page
- Admin users go to `/admin/dashboard`
- Regular users go to `/`
- Uses `router.replace()` instead of `router.push()` to prevent back-button issues

#### c) **Conditional Rendering**

```typescript
// Show loading state while checking auth
if (status === "loading") {
  return <div>Loading...</div>;
}

// Show login form only if unauthenticated
if (status === "unauthenticated") {
  return (/* login form */);
}

// Never reached if auth is working correctly
return null;
```

**Logic Flow:**

1. Component mounts → Check authentication status
2. `status === "loading"` → Show "Loading..." message
3. `status === "authenticated"` → Trigger redirect effect
4. `status === "unauthenticated"` → Display login form

---

### 3. **Login Handler** (`handleLogin` function)

After successful login, the app checks user role and redirects accordingly:

```typescript
if (result?.ok) {
  const session = await fetch("/api/auth/session").then((res) => res.json());

  if (session?.user?.role === "admin") {
    router.push("/admin/dashboard");
  } else {
    router.push("/");
  }
}
```

---

## User Journey

### **Scenario 1: New/Logged-Out User**

```
1. User visits app or any route (e.g., /)
   ↓
2. Middleware checks for auth token
   ↓
3. No token found → Redirect to /auth/login
   ↓
4. Login page loads
   ↓
5. useSession() returns status="unauthenticated"
   ↓
6. Login form is displayed
   ↓
7. User enters credentials and clicks "Sign In"
   ↓
8. Credentials validated via NextAuth
   ↓
9. Session created with user data (including role)
   ↓
10. Role checked → Redirect to / or /admin/dashboard
```

### **Scenario 2: Logged-In User (Regular)**

```
1. User visits app (token exists in browser)
   ↓
2. Middleware validates token → Allowed
   ↓
3. User sees home page (/)
   ↓
4. User manually navigates to /auth/login
   ↓
5. Login page mounts
   ↓
6. useSession() returns status="authenticated"
   ↓
7. useEffect auto-redirect triggers
   ↓
8. User redirected back to /
```

### **Scenario 3: Logged-In User (Admin)**

```
1. Admin logs in with valid credentials
   ↓
2. Session created with role="admin"
   ↓
3. Role check → Redirect to /admin/dashboard
   ↓
4. Admin can access protected admin routes
   ↓
5. If admin tries to access /auth/login
   ↓
6. Auto-redirect back to /admin/dashboard
```

---

## Key Technologies

### **NextAuth.js**

- Handles authentication and session management
- Provides `useSession()` hook and `getServerSession()` function
- Stores JWT tokens securely

### **Next.js Middleware**

- Runs on every request at the edge
- Can check authentication before route loads
- Redirects without loading the page first

### **JWT Token**

- Secure token stored in HTTP-only cookie (by NextAuth)
- Checked by middleware and login page
- Contains user data including role

---

## Configuration Files

### **middleware.ts**

```typescript
// Protects routes, redirects unauth users to login
// Allows /auth/* and /api/* without auth
```

### **app/auth/login/page.tsx**

```typescript
// Prevents logged-in users from accessing login page
// Redirects to home or admin dashboard based on role
```

### **app/auth/[...nextauth]/route.ts** (existing)

```typescript
// Handles login/logout
// Manages JWT and session
// Validates credentials against database
```

---

## Security Benefits

✅ **No Unauthorized Access** - Middleware blocks unauthenticated requests  
✅ **Role-Based Routing** - Admin/User treated differently after login  
✅ **Session Protection** - JWT tokens are HTTP-only (XSS safe)  
✅ **No Login Page Bypass** - Logged-in users can't access login form  
✅ **CSRF Protection** - NextAuth handles CSRF tokens automatically

---

## Troubleshooting

### User stuck on login page

- Check browser console for errors
- Verify `NEXTAUTH_SECRET` environment variable is set
- Check that MongoDB connection is working

### Middleware not redirecting

- Ensure `middleware.ts` is in the root project directory
- Restart dev server after changing middleware
- Check matcher pattern in middleware config

### Session not persisting

- Verify NextAuth callbacks are correct
- Check that `authOptions` are exported from route.ts
- Ensure login page has `useSession()` hook

---

## Environment Variables Required

```env
NEXTAUTH_SECRET=your-secret-key (generate with: openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000 (or your deployment URL)
MONGO_URI=your-mongodb-connection-string
```

---

## Summary

The authentication system creates a secure, seamless user experience by:

1. **Middleware** prevents unauthenticated access to protected routes
2. **Login Page** prevents authenticated users from seeing the login form
3. **useSession Hook** provides real-time authentication status
4. **Role-Based Routing** directs users to appropriate dashboards
5. **Auto-Redirect** handles all navigation automatically

This ensures users always see the login page first unless authenticated, and logged-in users can't access the login page.
