# Use a lightweight NGINX image
FROM nginx:alpine

# Copy your built static site into NGINX's serving directory
COPY ./website /usr/share/nginx/html

# Expose port 80 for Cloud Run
EXPOSE 80

# NGINX runs automatically as the container entrypoint
