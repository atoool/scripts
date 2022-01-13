#!/bin/sh
# This is a comment!
read -p "name&version :" v
cp android/app/build/outputs/apk/release/app-release.apk $HOME/desktop
echo "copied apk to desktop"
mv $HOME/desktop/app-release.apk $HOME/desktop/$v.apk