#!/bin/bash
rm -f Shimmer.zip
npm run electron:build -- --linux deb --win nsis
pkg ../moonlight-gameserver/index.js
mv index-win.exe ./ShimmerServer.exe
cp ../moonlight-gameserver/install.bat .
7z a -tzip ShimmerUI.zip ./dist_electron/*.exe ./dist_electron/*.deb
7z a -tzip ShimmerServer.zip ./ShimmerServer.exe ./install.bat