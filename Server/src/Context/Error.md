# Error Log & Prevention (ErrorControl)

This file tracks technical mistakes, architectural missteps, and configuration errors to ensure they are not repeated.

## Logged Errors

### 1. Environment Variable Naming
- **Error:** Code was looking for `JWT_SECRET` while the `.env` used `TOKEN`.
- **Prevention:** Always verify the actual key names in `.env` before implementing logic that depends on them.

### 2. Cookie Security in Local Dev
- **Error:** Setting `secure: true` for cookies in a non-production environment.
- **Result:** Cookies were not saved because local development usually runs on `http`, not `https`.
- **Prevention:** Use `secure: process.env.NODE_ENV === 'production'` to ensure compatibility with local `http` environments.

### 3. Middleware Placement
- **Error:** Applying `protect` middleware to the `/login` route.
- **Result:** Users couldn't log in because they didn't have the token yet that the middleware requires.
- **Prevention:** Authentication routes (Login/Register) must remain public.

### 4. Shell Command Syntax (Windows/PowerShell)
- **Error:** Using `&&` to chain commands.
- **Result:** PowerShell 5.1 (default on many systems) does not support `&&`.
- **Prevention:** Use `;` or separate commands when running on `win32` systems.
