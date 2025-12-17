# Deployment Guide

## 🌍 Deploying to Render

This project is deployed on **Render** as a Web Service.

### Phase 1: Backend
*(Refer to Backend Documentation for full details)*
Ensure the backend is deployed and you have the **HTTPS URL** (e.g., `https://campussyncbackend-ybn0.onrender.com`).

### Phase 2: Frontend Deployment

1.  **Create New Web Service** on Render.
2.  **Connect Repo**: Select `CampusSyncFrontEnd`.
3.  **Runtime**: Select **Docker**.
4.  **Region**: Select a region close to your users (e.g., Singapore).
5.  **Environment Variables**:
    *   Find the "Environment Variables" section.
    *   Add `VITE_API_URL` = `https://campussyncbackend-ybn0.onrender.com`.
    *   *Important*: Ensure no trailing slash `/` at the end unless your code expects it.

### 🔄 CI/CD (Auto-Deploy)
Render automatically re-builds and deploys whenever you push changes to the `main` branch (or whichever branch you configured).

### 🔍 Troubleshooting
*   **404 on Refresh**: Check if `nginx.conf` is correctly copied and configured to redirect to `index.html`.
*   **API Errors**: Verify `VITE_API_URL` is set correctly in Render dashboard (check the Logs to see if it was picked up during build).
