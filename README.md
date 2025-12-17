# CampusSync 

<div align="center">
  <img src="./public/WebsiteLogoWhiteBackGround.png" alt="CampusSync Logo" width="50%" />
</div>

A centralized, communication platform designed to unify the USTP community under one trusted digital ecosystem. It streamlines access to events, announcements, and lost&found items while eliminating dependence on scattered social media channels and unverified sources.
 
## 🌐 Live Demo

*   **Frontend**: [CampusSync Frontend](https://campussyncfrontend.onrender.com)
*   **Backend API**: [CampusSync Backend](https://campussyncbackend-ybn0.onrender.com)

## 📚 Documentation
We have prepared comprehensive documentation for the project defense:

*   **[Features & User Guide](./docs/UserGuide.md)**
*   **[Technical Architecture](./docs/technical/Architecture.md)**
*   **[Security & Privacy](./docs/features/AuthSystem.md)**
*   **[Future Roadmap](./docs/FutureRoadmap.md)**

[**View Full Documentation**](./docs/ProjectOverview.md)

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

## 💡 Design Decisions

This project prioritizes **performance, maintainability, and scalability**.

*   **React 19 & Vite**: Selected for a modern, high-performance development experience. Vite provides instant server start and lightning-fast HMR (Hot Module Replacement), while React 19 introduces newer concurrency features for smoother UI interactions.
*   **TailwindCSS**: Chosen for its utility-first approach, allowing for rapid UI development and consistent design tokens without the overhead of writing custom CSS classes.
*   **Docker Multi-Stage Build**: Implemented to keep the final production image lightweight. The build process happens in a separate node environment, and only the compiled static assets are copied to the final Nginx container, significantly reducing image size.
*   **Nginx as Web Server**: Used to serve the static frontend assets efficiently. It is also configured to handle client-side routing by redirecting all unknown requests to `index.html`, ensuring the Single Page Application (SPA) works correctly.
*   **TypeScript**: Enforced to ensure type safety across the application, reducing runtime errors and improving developer productivity through better autocomplete and code intelligence.

## 📂 Project Structure

```
frontend/
├── docs/               # 📚 Comprehensive Project Documentation
│   ├── features/       # Feature-specific guides (Auth, Posts, User)
│   ├── technical/      # Architecture, Tech Stack, & Deployment docs
│   ├── ProjectOverview.md
│   ├── UserGuide.md
│   └── ...
├── public/             # Static assets (Logos, Icons)
├── src/
│   ├── api/            # 🔌 Axios configuration & API keys
│   ├── components/     # 🧩 Reusable UI components (Buttons, Cards)
│   ├── pages/          # 📄 Application Routes/Views
│   ├── hooks/          # 🪝 Custom React Hooks
│   ├── types/          # 🏷️ TypeScript Interfaces/Types
│   ├── utils/          # 🛠️ Helper Functions
│   └── App.tsx         # Main entry component
├── .env                # Environment variables
├── Dockerfile          # 🐳 Multi-stage Docker configuration
├── nginx.conf          # 🌐 Nginx configuration for SPA routing
├── package.json        # Dependencies & Scripts
├── tailwind.config.js  # Styling configuration
└── vite.config.ts      # Vite build configuration
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
