# Architecture

## 🏗 High-Level Overview
CampusSync Frontend is a **Single Page Application (SPA)** built with **React 19**. It communicates with a separate backend API via **Axios**.

## 🧩 Component Structure
We follow a component-based architecture, organized by domain:

*   **`components/`**: Reusable UI elements (atoms/molecules) like Buttons, Inputs, Cards.
*   **`pages/`**: View components representing full pages (e.g., `LoginPage`, `FeedPage`).
*   **`layouts/`**: (If applicable) Wrapper components for consistent page structure (Navbar, Sidebar).

## 🛣 Routing
**React Router DOM 7** handles client-side routing.
*   **Public Routes**: Login, Register.
*   **Protected Routes**: accessible only to authenticated users (checked via JWT/Session).
*   **Role-Based Routes**: Certain routes (like `Create Organization`) are guarded for Moderators only.

## 💾 State Management
*   **Local State**: `useState` / `useReducer` for component-specific logic.
*   **Server State**: Managed via `Axios` and `useEffect` (or React Query if added later).
*   **Global Auth State**: Handled via React Context to enable/disable features based on the logged-in user.

## 🔌 API Integration
*   **Axios Instance**: A configured `api` instance in `src/api/` handles base URLs and default headers.
*   **Interceptors**: Used for attaching tokens and handling global error responses (e.g., 401 Unauthorized).
