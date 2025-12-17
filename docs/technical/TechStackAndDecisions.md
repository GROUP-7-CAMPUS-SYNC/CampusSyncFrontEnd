# Tech Stack & Decisions

## 🛠 Core Technologies

### 1. React 19
**Why?**
*   Latest concurrency features for smoother UI.
*   Improved standard for hooks and functional components.
*   Ecosystem stability.

### 2. Vite
**Why?**
*   **Performance**: Instant server start vs Webpack.
*   **HMR**: Lightning-fast Hot Module Replacement during development.
*   **Build**: Optimized Rollup-based production builds.

### 3. TailwindCSS v4
**Why?**
*   **Speed**: Utility-first approach reduces context switching.
*   **Consistency**: Design tokens ensure consistent spacing, colors, and typography.
*   **Size**: Unused styles are purged, resulting in tiny CSS bundles.

### 4. TypeScript
**Why?**
*   **Safety**: Catches errors at compile time (e.g., missing props, wrong data types).
*   **Experience**: vastly improved autocomplete and refactoring capabilities in VS Code.

## 📜 Architectural Decisions Records (ADR)

### ADR-001: Multi-Stage Docker Build
*   **Decision**: Use a multi-stage Dockerfile.
*   **Reason**: To separate the build environment (Node.js, heavy) from the runtime environment (Nginx, light).
*   **Result**: Production image size reduced from ~1GB to <50MB.

### ADR-002: Nginx for Static Serving
*   **Decision**: Use Nginx to serve the `dist` folder.
*   **Reason**: High performance for static assets; handles SPA routing (`try_files $uri /index.html`) natively.
