# CampusSync 

<div align="center">
  <img src="./public/WebsiteLogoWhiteBackGround.png" alt="CampusSync Logo" width="50%" />
</div>

A centralized, communication platform designed to unify the USTP community under one trusted digital ecosystem. It streamlines access to events, announcements, and lost&found items while eliminating dependence on scattered social media channels and unverified sources.
 
## 🌐 Live Demo

*   **Frontend**: [CampusSync Frontend](https://campussyncfrontend.onrender.com)
*   **Backend API**: [CampusSync Backend](https://campussyncbackend-ybn0.onrender.com)

## 🔑 User Credentials & Roles

### Role Descriptions
*   **Moderator Account**: Authorized to designate Organization Heads and create new organizations within the system.
*   **Standard User Accounts**: Encompasses both Organization Heads and regular members.
    *   **Organization Heads**: Authorized to create, edit, and delete organization-wide posts.
    *   **Regular Members**: Authorized to create, edit, and delete only their own personal posts.

### Sample Account Credentials

#### 1. Moderator
*   **Name**: Gabriela Silang
*   **Email**: `gabriela.silang@1.ustp.edu.ph`
*   **Password**: `securePassword123`

#### 2. Standard Users

**Juan DelaCruz**
*   **Email**: `juan.delacruz@1.ustp.edu.ph`
*   **Password**: `securePassword123`


**Maria Santos**
*   **Email**: `maria.santos@1.ustp.edu.ph`
*   **Password**: `securePassword123`

**Jose Rizal**
*   **Email**: `jose.rizal@1.ustp.edu.ph`
*   **Password**: `securePassword123`

**Andres Bonifacio**
*   **Email**: `andres.bonifacio@1.ustp.edu.ph`
*   **Password**: `securePassword123`

**Emilio Aguinaldo**
*   **Email**: `emilio.aguinaldo@1.ustp.edu.ph`
*   **Password**: `securePassword123`

**Apolinario Mabini**
*   **Email**: `apolinario.mabini@1.ustp.edu.ph`
*   **Password**: `securePassword123`

**Melchora Aquino**
*   **Email**: `melchora.aquino@1.ustp.edu.ph`
*   **Password**: `securePassword123`

**Antonio Luna**
*   **Email**: `antonio.luna@1.ustp.edu.ph`
*   **Password**: `securePassword123`

**Gregorio DelPilar**
*   **Email**: `gregorio.delpilar@1.ustp.edu.ph`
*   **Password**: `securePassword123`

## 🚀 Technologies

*   **Framework**: React 19
*   **Build Tool**: Vite
*   **Language**: TypeScript
*   **Styling**: TailwindCSS v4
*   **Routing**: React Router DOM 7
*   **HTTP Client**: Axios
*   **Icons**: Lucide React, React Icons

## 🛠️ Installation & Setup

1.  **Navigate to the directory**:
    ```bash
    cd CampusSyncFrontEnd
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The app will typically run at `http://localhost:5173`.

4.  **Build for Production**:
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
src/
├── api/            # API configuration (Axios)
├── components/     # Reusable UI components
├── pages/          # Application views/routes
├── hooks/          # Custom React hooks
├── types/          # TypeScript interface definitions
├── utils/          # Helper functions
└── App.tsx         # Main application component
```

## 🐳 Docker Support

This project uses a **multi-stage Docker build** to create an optimized production image served with **Nginx**.

### Prerequisites
*   Docker installed on your machine.
*   (Optional) A backend API URL if deploying for production.

### 1. Build the Docker Image
To build the image, use the command below. You can update `VITE_API_URL` to point to your backend.

```bash
# Build with default API URL or specific one
docker build --build-arg VITE_API_URL="http://localhost:8000/api" -t campussync-frontend .
```

### 2. Run the Container
Start the container and map it to a local port (e.g., 3000):

```bash
docker run -d -p 3000:80 --name campussync-client campussync-frontend
```

*   The app will be accessible at: `http://localhost:3000`
*   Nginx is configured (`nginx.conf`) to handle SPA routing (redirecting 404s to `index.html`).

## Phase 2: Frontend Deployment

### Objective
We deployed the React client, ensuring the **Backend URL** was baked into the build artifacts.

### Initiating Service
1.  We selected **New + > Web Service**.
2.  We connected the `CampusSyncFrontEnd` GitHub repository.

### Configuring Build & Runtime
*   **Name**: `CampusSyncFrontEnd`
*   **Region**: Singapore
*   **Runtime**: Docker

### Configuring Build Arguments
**Context**: Our `Dockerfile` uses `ARG VITE_API_URL` to inject the API endpoint into the static files during the build phase.

1.  We navigated to the **Environment Variables** section.
2.  We added the following Key/Value pair to link the services:
    *   **Key**: `VITE_API_URL`
    *   **Value**: *[Backend URL generated in Phase 1]*
3.  We ensured there was no trailing slash on the URL to prevent routing errors.

### Deployment Execution
1.  We clicked **Create Web Service**.
2.  **Render** executed our Multi-stage Docker build:
    *   **Stage 1**: Node installed dependencies and ran `npm run build` using the injected `VITE_API_URL`.
    *   **Stage 2**: Nginx started and served the `/dist` folder on Port 80.
## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **Auth Feature** | Users can register using an institutional email address ending in "@1.ustp.edu.ph" and select their course during registration. Registered users can log in using their email and password to access system features. |
| **Post Management** | Standard users can create posts in the **Lost and Found** section. Organization Heads (assigned by Moderators) and Moderators can post in the **Announcement** and **Event** sections. Users can edit or delete their own Lost and Found posts, while Organization Heads can manage posts within their assigned scope. |
| **Post-based Messaging** | Users can send and receive messages related to Lost and Found posts. Messaging is initiated through a post, allowing users to communicate directly with the post owner within a single message thread. |
| **Search Feature** | The system provides section-specific and global search features that allow users to find posts by matching keywords in the post title. |
| **Moderator Feature** | Moderators can create, update, or delete organizations (including names and descriptions). They also assign specific users as **Organization Heads**. |
| **Saved Post Management** | Users can save posts from any section for quick access and future reference. |
| **Witness Feature** | The Lost and Found section includes a witness feature that allows other users to provide support or confirmation for a post to help indicate the legitimacy of reported lost items. |
| **Event Notification** | Users can opt in to receive notifications for specific event posts to help them remember and stay informed about important or mandatory events. |
| **User Profile Viewing** | The system provides a user profile page that displays basic user information, total number of posts created, and a feed of all posts authored by the user. |
| **Responsive Design** | Optimized for both desktop and mobile views. |
