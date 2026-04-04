#!/bin/bash
mkdir ./webext/
openssl genrsa -out ./webext/webapp.pem 2048
web-ext build --source-dir=./frontend --artifacts-dir=./webext/ --overwrite-dest=true -n webapp.xpi
cd ./frontend && zip -r -9 - . | crx3 -p ../webext/webapp.pem -o ../webext/webapp.crx && cd ../
