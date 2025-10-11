FROM httpd:2.4

# Enable SSI module
RUN sed -i '/LoadModule include_module/s/^#//g' /usr/local/apache2/conf/httpd.conf

# IMPORTANT: Change Apache to listen on port 8080 (Cloud Run requirement)
RUN sed -i 's/^Listen 80/Listen 8080/' /usr/local/apache2/conf/httpd.conf

# Allow SSI in root and enable Options Includes
RUN sed -i 's/Options Indexes FollowSymLinks/Options Indexes FollowSymLinks Includes/g' /usr/local/apache2/conf/httpd.conf

# Allow SSI for HTML files
RUN echo "AddType text/html .html" >> /usr/local/apache2/conf/httpd.conf
RUN echo "AddOutputFilter INCLUDES .html" >> /usr/local/apache2/conf/httpd.conf

# ✅ Copy ONLY your website files (like before)
COPY ./website /usr/local/apache2/htdocs/

EXPOSE 8080
