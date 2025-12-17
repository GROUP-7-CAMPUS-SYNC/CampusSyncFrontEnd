# Authentication System

## 🔐 Overview
The authentication system secures the platform by ensuring only verified USTP community members can access it.

## 📧 Institutional Email Validation
*   **Rule**: Emails must end with the `@1.ustp.edu.ph` domain.
*   **Reason**: To guarantee that every user is a legitimate student or faculty member of USTP.

## 📝 Registration Flow
1.  User submits Email, Password, and Course.
2.  Frontend validates the email format (Regex).
3.  Backend checks if the user already exists.
4.  If unique, account is created with `user` role by default.

## 🔑 Login Flow
1.  User submits credentials.
2.  Backend verifies password hash.
3.  **JWT (JSON Web Token)** is issued (or session cookie set).
4.  Frontend stores the token/cookie and updates the global Auth Context.
5.  User is redirected to the Feed.

## 🛡 Roles & Permissions
*   **Standard User**: Default. Can post in Lost & Found.
*   **Organization Head**: Assigned by Moderator. Can post Announcements/Events.
*   **Moderator**: Super admin. Can manage Orgs and Heads.
