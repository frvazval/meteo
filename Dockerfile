# Versión de la imagen que vamos a utilizar
FROM httpd:latest
COPY ./ /usr/local/apache2/htdocs/