# Docker Deployment

## 🐳 Dockerfile Explained

Our `Dockerfile` consists of two stages:

### Stage 1: Build (`node:22-alpine`)
1.  Sets work directory to `/app`.
2.  Copies `package.json` and installs dependencies (`npm install`).
3.  Copies source code.
4.  Accepts build argument `VITE_API_URL`.
5.  Runs `npm run build` to generate the `/dist` folder.

### Stage 2: Serve (`nginx:alpine`)
1.  Copies the `/dist` folder from Stage 1 to Nginx html directory.
2.  Copies custom `nginx.conf`.
3.  Exposes Port 80.
4.  Starts Nginx.

## 🛠 Nginx Configuration
The `nginx.conf` is critical for Single Page Applications (SPAs).
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```
This ensures that if a user visits `/profile` directly, Nginx doesn't look for a `profile` file but serves `index.html` (letting React Router handle the view).

## 🏃‍♂️ Running Locally with Docker

1.  **Build the Image**:
    ```bash
    docker build -t campussync-frontend .
    ```

2.  **Run the Container**:
    ```bash
    docker run -d -p 3000:80 campussync-frontend
    ```
    Access at `http://localhost:3000`.
