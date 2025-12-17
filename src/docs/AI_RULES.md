# AI Context & Rules

## 🛠 Tech Stack
*   **Frontend**: React 19, Vite, TypeScript, TailwindCSS v4.
*   **Routing**: React Router DOM 7.
*   **HTTP**: Axios.
*   **Deployment**: Docker (Multi-stage), Nginx, Render.

## 💎 Design System
*   **Styling**: Use TailwindCSS v4 utility classes. Avoid custom CSS files unless absolutely necessary for complex animations.
*   **Icons**: Lucide React is the primary icon set. React Icons is secondary.
*   **Components**: Functional components with TypeScript interfaces for Props.

## 📝 Coding Conventions
*   **File Naming**: PascalCase for components (`MyComponent.tsx`), camelCase for hooks/utils (`useAuth.ts`).
*   **State Management**: Prefer local state for UI, Context API for global auth/theme.
*   **Type Safety**: Avoid `any`. Define proper interfaces in `src/types/`.

## 🐳 Docker Rules
*   Use `ARG` for build-time variables (like `VITE_API_URL`).
*   Ensure Nginx handles the routing fallback to `index.html`.
