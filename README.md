Demo full-stack (BE Node.js, FE React/Vite) with Docker and GitHub Actions

Local quickstart (requires Docker):

```bash
# From repository root
# Build and run services
docker-compose up --build

# Backend API: http://localhost:3000
# Frontend served by nginx: http://localhost:5174
```

GitHub Actions / CI notes:
- Backend image build uses secrets: `REGISTRY_HOST`, `REGISTRY_USERNAME`, `REGISTRY_PASSWORD`, `REGISTRY_NAMESPACE`.
- Frontend deploy uses `AZURE_STATIC_WEB_APPS_API_TOKEN` for Azure SWA.

Optional: deploy backend to Azure App Service using publish profile secrets or push image to ACR and configure App Service.

Files added:
- BE/* : backend source and Dockerfile
- FE/* : frontend Vite app and Dockerfile
- docker-compose.yml : local orchestration
- .github/workflows/* : CI workflows

Next: run `docker-compose up --build` to test locally. 
