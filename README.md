# Shimmer UI

![Shimmer UI](https://db3pap001files.storage.live.com/y4mb1AO03ZCt3nKQrLglTGAdJZQMsdtuY4-vwN5vELUm_l4B5Of4_7dvRsvBMOtvtwzJsdMnWkUdDdKUYrPUmcLEpZtCDXRVv3eQfAed1FwBWUWFGQLhdZUwANDOwdb21AYllxFFf8N8GzQftN0uQjuO0VpTf3GrsxNDsyTWDPnN6jzIM06mFSqeydegEalyoqi?width=1024&height=560&cropmode=none)

Welcome to Shimmer!
Shimmer is an attempt at making Moonlight a little bit easier to use.

This application is developed with support from, and integration with [Maximum Settings](https://maximumsettings.com). It is highly recommended to use this application with a Maximum Settings machine, but it is possible to use it with any host which can host Moonlight sessions, and which has the ability to open custom ports.

## How to Install

The first thing to ensure, is that you already have a computer setup which you can access using Moonlight, and that you have either `mstsc.exe` or the custom Moonlight `GameStreamMouseFix.exe` setup as a custom game in your GeForce Experience. This will not be detailed here, but we may release an installer to do this automatically later. If you have a Maximum Settings Machine, this is already done for you, and you can use `mstsc.exe` as your Desktop App Name.

You will also need to install and configure Playnite on the host. Once you have installed Playnite, please run it, and set up your Steam library, Origin library etc. Please check their documentation for more information on this. [https://playnite.link](https://playnite.link/).

You will then need to install VB Cable, also on the host. [https://vb-audio.com/Cable/](https://vb-audio.com/Cable/)

On your remote machine (eg. the Maximum Settings machine), download and run the latest `SSI-SXA.exe` from [https://github.com/CameronRedmore/ShimmerUI/releases/](https://github.com/CameronRedmore/ShimmerUI/releases/).

This will create a folder in the same directory named `ShimmerServerInstaller`. Inside this directory is a file called `install.bat`. Please run this file with a double click (do ***not*** right click and run as administrator, this will cause issues).

The installer will automatically attempt to find your Playnite directories, but if it cannot find them, it will ask you for your Playnite install and library locations.

At the end of the installer, you will be given a password. Please note this down as you will need to enter this into your client later on.

To install the client, on your *local machine*, grab the latest version of `Shimmer UI Setup.exe` from [https://github.com/CameronRedmore/ShimmerUI/releases/](https://github.com/CameronRedmore/ShimmerUI/releases/) and follow this installer through.

Once all of these are installed and configured, you're ready to go! Search for and open `Shimmer` on your local PC, configure the settings to your liking (the only thing that will likely need changing to start with is your remote machine's IP. You can find this on your Maximum Settings panel if coming from there). Another aspect that is likely to need changing is the `Desktop App Name`. This should be the name that you have given to your `mstsc.exe` in GeForce Experience, on Maximum Settings machines, this is `mstsc.exe` by default).

If you are a Maximum Settings customer, you can enter your username and password into the appropriate fields on the settings screen, this will then enable a large number of functions for Maximum Settings, including power control, current machine status and easy-access to the Maximum Settings panel.

Once you have configured your settings, you'll be able to fully enjoy Shimmer! Close the settings menu, and start using it!

Please post any suggestions and / or bugs over in the [issue tracker](https://github.com/CameronRedmore/ShimmerUI/issues) on this GitHub repo, and be sure to check for duplicates first!
