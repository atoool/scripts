#!/bin/sh
# This is a comment!
find $HOME/Library/Developer/Xcode/DerivedData -type f -print0 | xargs -0 rm -f
find $HOME/Library/Developer/Xcode/Archives -type f -print0 | xargs -0 rm -f
find $HOME/Library/Caches/Yarn/v6 -type f -print0 | xargs -0 rm -f
find $HOME/.gradle/caches -type f -print0 | xargs -0 rm -f
find $HOME/.gradle/wrapper -type f -print0 | xargs -0 rm -f