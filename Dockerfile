FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli@17
RUN npm install
RUN ng build --configuration=production

FROM nginx:alpine
COPY --from=build /app/dist/webapp/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
