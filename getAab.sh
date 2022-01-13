#!/bin/sh
# This is a comment!
read -p "name&version :" v
cp android/app/build/outputs/bundle/release/app-release.aab $HOME/desktop
echo "copied aab to desktop"
mv $HOME/desktop/app-release.aab $HOME/desktop/$v.aab