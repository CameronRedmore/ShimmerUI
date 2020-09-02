# Shimmer UI
Welcome to Shimmer!
Shimmer is an attempt at making Moonlight a little bit easier to use. The application was designed for [Fire Power Cloud](https://firepower.cloud), but should work with any system which you can connect to via Moonlight.

## How to Install
The first thing to ensure, is that you already have a computer setup which you can access using Moonlight, and that you have either `mstsc.exe` or the custom Moonlight `GameStreamMouseFix.exe` setup as a custom game in your GeForce Experience. This will not be detailed here, but we may release an installer to do this automatically later. If you have a Fire Power Cloud FireBox, this is already done for you and you can ignore this section.

To install, grab the latest `ShimmerUI.zip` from the [releases section](https://github.com/CameronRedmore/ShimmerUI/releases) of this repo. Extract this to anywhere you like. You will need to run the `Shimmer - Moonlight Interface` setup file on your client which runs Moonlight to install `Shimmer UI` on your PC.

You will then need to download `ShimmerServer.zip` on your host which runs NVIDIA GameStream (eg. on a FirePowerCloud FireBox). Inside is a `install.bat`, run this file to run the ShimmerServer and automatically copy the `ShimmerServer.exe` to your startup folder to launch the application with Windows (to allow easy connection thereafter).

Once both of these are installed, you're ready to go! Search for and open `Shimmer` on your local PC, configure the settings to your liking (the only thing that will likely need changing to start with is your IP, if coming from Fire Power Cloud, this is your Fire Box's IP!). The only other aspect that is likely to need changing is the `Desktop app name`. This should be the name that you have given to your `mstsc.exe` in GeForce Experience, on Fire Power Cloud Fire Boxes, this is `Desktop` by default, and the application will automatically use this by defualt too). Once you have configured your settings, you'll be able to fully enjoy Shimmer!

Please note that the first launch can take a very long time whilst the ShimmerServer caches data for your games. Subsequent runs will take nowhere *near* as much time.

## Current Platform Support
- Windows

## Planned Platform Support
- Linux
- macOS

## Current Game Provider Support
- Steam

## Planned Platform Support
- Epic Games Store
- Origin
- Uplay
- Battle.net

Please post any suggestions and / or bugs over in the [issue tracker](https://github.com/CameronRedmore/ShimmerUI/issues) on this GitHub repo, and be sure to check for duplicates first!
