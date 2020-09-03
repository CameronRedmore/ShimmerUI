#!/bin/bash
rm -fr dist_electron/Shimmer*
rm -fr dist_electron/shimmer*
rm -f Shimmer.zip
npm run electron:build -- --linux deb rpm AppImage snap pacman tar.gz --win nsis
mkdir -p dist
mv dist_electron/Shimmer* dist
mv dist_electron/shimmer* dist
pkg ../ShimmerServer/index.js
mv index-win.exe ./ShimmerServer.exe
cp ../ShimmerServer/install.bat .
7z a -tzip ShimmerServer.zip ./ShimmerServer.exe ./install.bat