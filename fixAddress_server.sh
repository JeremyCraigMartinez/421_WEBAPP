#!/bin/sh

location="~/421_WEBAPP/myapp/app/assets/javascripts/app/services"
ext="js"
localAddress="localhost"
serverAddress="104.236.169.12"


echo "Changing $localAddress to $serverAddress recursively in '$location'"

find $location -name "*.$ext" -print | xargs sed -i "s/$localAddress/$serverAddress/g"

if [ $? -eq 0 ]; then
    echo "Success!"
else
    echo "FAILED"
fi
