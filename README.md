# CampusSync Frontend

The frontend user interface for CampusSync, built with React, TypeScript, and Vite. It features a modern, responsive design using TailwindCSS.

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

This project includes a `Dockerfile` and `nginx.conf` for production deployment via Nginx.
To build the image:
```bash
docker build -t campussync-frontend .
```

## ✨ Key Features

*   **Auth Feature**: Users can register using an institutional email address ending in "@1.ustp.edu.ph" and select their course during registration. Registered users can log in using their email and password to access system features.
*   **Post Management**: Standard users can create posts in the **Lost and Found** section. Organization Heads (assigned by Moderators) and Moderators can post in the **Announcement** and **Event** sections. Users can edit or delete their own Lost and Found posts, while Organization Heads can manage posts within their assigned scope.
*   **Post-based Messaging Feature**: Users can send and receive messages related to Lost and Found posts. Messaging is initiated through a post, allowing users to communicate directly with the post owner within a single message thread.
*   **Search Feature**: The system provides section-specific and global search features that allow users to find posts by matching keywords in the post title.
*   **Moderator Feature**: Moderators can create, update, or delete organizations (including names and descriptions). They also assign specific users as **Organization Heads**.
*   **Saved Post Management**: Users can save posts from any section for quick access and future reference.
*   **Witness Feature**: The Lost and Found section includes a witness feature that allows other users to provide support or confirmation for a post to help indicate the legitimacy of reported lost items.
*   **Event Notification Feature**: Users can opt in to receive notifications for specific event posts to help them remember and stay informed about important or mandatory events.
*   **User profile Viewing**: The system provides a user profile page that displays basic user information, total number of posts created, and a feed of all posts authored by the user.
*   **Responsive Design**: Optimized for both desktop and mobile views.
