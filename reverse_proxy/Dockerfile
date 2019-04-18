FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
# COPY proxy.crt /etc/nginx/proxy.crt
# COPY proxy.key /etc/nginx/proxy.key

CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80