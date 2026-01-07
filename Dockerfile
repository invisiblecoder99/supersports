# Single container running both frontend and backend
FROM node:18-alpine

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor curl

WORKDIR /app

# Backend setup
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

COPY backend/ ./backend/
RUN cd backend && npx prisma generate && mkdir -p /app/backend/data

# Frontend setup
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

COPY frontend/ ./frontend/

# Build frontend with API URL
ENV VITE_API_URL=/api
RUN cd frontend && npm run build

# Setup nginx
RUN mkdir -p /run/nginx
COPY <<EOF /etc/nginx/http.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /app/frontend/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_read_timeout 300s;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
}
EOF

# Setup supervisor to run both services
COPY <<EOF /etc/supervisord.conf
[supervisord]
nodaemon=true
user=root

[program:backend]
command=sh -c "cd /app/backend && npx prisma db push && node src/index.js"
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
environment=DATABASE_URL="file:./data/supersports.db",JWT_SECRET="%(ENV_JWT_SECRET)s",PORT="3000",NODE_ENV="production",FRONTEND_URL="%(ENV_FRONTEND_URL)s"

[program:nginx]
command=nginx -g "daemon off;"
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOF

ENV JWT_SECRET=change-this-secret-in-production
ENV FRONTEND_URL=http://localhost
ENV PORT=80

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
