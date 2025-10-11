call copy_website.bat
start http://localhost:888/index.html
docker build -t myschool-app .
docker run -p 888:8080 myschool-app
