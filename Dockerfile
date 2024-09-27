FROM node:20 as build
WORKDIR /app
COPY my-kpi/ .
RUN npm i --legacy-peer-deps

ENV VITE_API_URL=https://api.mykpi.online/api

RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
