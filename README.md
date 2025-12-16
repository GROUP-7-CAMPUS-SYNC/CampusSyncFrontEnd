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

*   **Organization Management**: Moderators can manage organization details and posts.
*   **Event & Academic Posts**: Users can view, save, and interact with various post types.
*   **Global Search**: Integrated search bar for finding content across the platform.
*   **Responsive Design**: Optimized for both desktop and mobile views.
