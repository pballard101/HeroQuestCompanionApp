docker buildx build \
  --platform linux/amd64 \
  -t 172.22.22.111:5000/heroquest-app:latest \
  . --push