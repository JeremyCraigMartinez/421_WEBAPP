#!/bin/sh

location="."
ext="js"
localAddress="dragon"
serverAddress="dog"


echo "Changing $localAddress to $serverAddress recursively in '$location'"

find $location -name "*.$ext" -print | xargs sed -i "s/$localAddress/$serverAddress/g"

if [ $? -eq 0 ]; then
    echo "Success!"
else
    echo "FAILED"
fi
