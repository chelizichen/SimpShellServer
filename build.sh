#!/bin/bash  

readonly ServerName="SimpShellServer"

rm -r ./dist
rm ./$ServerName.tar.gz
mkdir ./dist

npm run client:build

npm run build

cp ./simp.yaml ./dist/
cp ./package.json ./dist/
cp ./package-lock.json ./dist/

cd dist 
npm i --production

tar -cvf $ServerName.tar.gz ./*

mv $ServerName.tar.gz ../
