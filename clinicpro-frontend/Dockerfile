FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ARG API_BASE_URL=https://clinicpro-backend-etfppa7d2q-ew.a.run.app
ENV API_BASE_URL=$API_BASE_URL
RUN node -e "const fs=require('fs'); const p='src/environments/environment.prod.ts'; const v=process.env.API_BASE_URL || 'https://REPLACE_WITH_BACKEND_URL'; fs.writeFileSync(p, 'export const environment = {\\n  apiBaseUrl: \\'' + v + '\\'\\n};\\n');"
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/clinicpro-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
