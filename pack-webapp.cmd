::call npm run build
mkdir .\pack\
call openssl genrsa -out ./pack/webapp.pem 2048
call crx3 ./webapp -p ./pack/webapp.pem -o ./pack/webapp.crx
call web-ext build --source-dir=./webapp --artifacts-dir=./pack/ --overwrite-dest=true -n webapp.xpi
pause
