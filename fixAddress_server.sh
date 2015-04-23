#!/bin/sh

location="~/421_WEBAPP/myapp/app/assets/javascripts/app/services" # consider using '.'
ext="js" #consider using '*'
localAddress="localhost"
serverAddress="104.236.169.12"

echo "Listing locations of '$localAddress'"
find $location -name "*.$ext" -print
echo

echo "Changing $localAddress to $serverAddress recursively in '$location'"
find $location -name "*.$ext" -print | xargs sed -i "s/$localAddress/$serverAddress/g"

if [ $? -eq 0 ]; then
    echo "Success!"
else
    echo "FAILED"
fi
echo
