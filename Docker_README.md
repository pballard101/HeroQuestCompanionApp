# HeroQuest Companion App - Docker Setup

This document explains how to run the HeroQuest Companion App using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed (usually comes with Docker Desktop)
- Docker Desktop or Docker daemon must be running

**Note:** Make sure Docker is running before executing any Docker commands. If you get an error about "Cannot connect to the Docker daemon", start Docker Desktop or the Docker service.

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. Navigate to the heroquestapp directory:
   ```bash
   cd heroquestapp
   ```

2. Build and run the application:
   ```bash
   docker-compose up --build
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

4. To stop the application:
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker directly

1. Build the Docker image:
   ```bash
   docker build -t heroquest-companion .
   ```

2. Run the container:
   ```bash
   docker run -d \
     --name heroquest-app \
     -p 3000:3000 \
     -v $(pwd)/data:/app/data \
     heroquest-companion
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

4. To stop the container:
   ```bash
   docker stop heroquest-app
   docker rm heroquest-app
   ```

## Configuration

### Environment Variables

- `PORT`: Port number for the application (default: 3000)
- `NODE_ENV`: Node.js environment (default: production)

### Data Persistence

The application data is stored in the `./data` directory and is mounted as a volume in the container. This ensures that your party data persists even when the container is restarted.

### Health Check

The Docker Compose setup includes a health check that monitors the application's availability. The health check runs every 30 seconds and attempts to reach the application at `http://localhost:3000`.

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can change the port mapping:

```yaml
# In docker-compose.yml, change:
ports:
  - "3001:3000"  # Maps host port 3001 to container port 3000
```

### Permission Issues

If you encounter permission issues with the data directory:

```bash
# Ensure the data directory has proper permissions
chmod 755 data
```

### Container Logs

To view application logs:

```bash
# Using Docker Compose
docker-compose logs -f

# Using Docker directly
docker logs -f heroquest-app
```

## Development

For development with hot reloading, you can override the command:

```bash
docker-compose run --rm -p 3000:3000 heroquest-app npm run dev
```

## Security Notes

- The application runs as a non-root user inside the container
- Only the necessary files are copied to the container (see `.dockerignore`)
- The data directory is the only persistent volume mounted

## ToDo List
- Add a way to upload images for your party
- Add a UI for changing names
- Add away to delete a party from the UI