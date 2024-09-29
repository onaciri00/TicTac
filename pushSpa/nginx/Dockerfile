# image python
FROM debian:latest

RUN apt-get update -y && apt-get upgrade -y && \
apt-get install nginx -y

# RUN mkdir -p /etc/nginx/ssl && \
#     openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
#         -keyout /etc/nginx/ssl/private.key \
#         -out /etc/nginx/ssl/certificate.pem \
#         -subj "/O=1337 School/CN=ayylaaba.42.fr"

COPY conf/nginx.conf /etc/nginx/conf.d

RUN mkdir -p var/www/front

COPY srcs /var/www/front

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
