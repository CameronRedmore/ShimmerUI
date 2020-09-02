#!/bin/bash
rm -f Shimmer.zip
npm run electron:build
pkg ../moonlight-gameserver/index.js
mv index-win.exe ./ShimmerServer.exe
7z a -tzip Shimmer.zip ./dist_electron/*.exe ./ShimmerServer.exe