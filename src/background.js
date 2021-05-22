'use strict'

import { app, protocol, BrowserWindow, shell, ipcMain, webFrameMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path';

import axios from 'axios';

const psList = require('ps-list');

const naudiodon = require('naudiodon');
const dgram = require('dgram');

const chunkingStreams = require('chunking-streams');
const SizeChunker = chunkingStreams.SizeChunker;

const storage = require('electron-json-storage');

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

//Create a reference to the Maxmimum Settings panel frame.
let mxsWin;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1600,
    height: 900,
    frame: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
      contextIsolation: false,
    },
    //titleBarStyle: 'hidden',
    icon: path.join(__static, 'icon.png'),
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
  
  win.webContents.on('did-frame-navigate', (event, url, httpResponseCode, httpStatusText, isMainFrame, frameProcessId, frameRoutingId) => {
    const frame = webFrameMain.fromId(frameProcessId, frameRoutingId);
    if (frame) {
      if (frame.url.startsWith("https://login.maximumsettings.com")) {
        let script = `
          let interval = setInterval(() => {
            if(document.head)
            {
              clearInterval(interval);

              let styleSheet = document.createElement("style");
              styleSheet.type = "text/css";

              styleSheet.innerText = 'footer {position: fixed; bottom: 0; left: 0; right: 0; text-align: center;} header {display: none !important;} main {padding-top: 40px; padding-bottom: 40px;} footer, .footer-bottom {margin-top: 0 !important; padding-top: 0 !important;} footer ul { margin-bottom: 0; }';

              document.head.appendChild(styleSheet);
            }
          }, 50);
        `.replace(/\n/g, "");
        frame.executeJavaScript(script);

        let config = storage.getSync("config");
        console.log(config);
        if (config && config.mxs.username && config.mxs.password) {
          let username = config.mxs.username;
          let password = config.mxs.password;
          let loginScript = `
            let loginInterval = setInterval(() => {
              let error = document.querySelector('#login_box > .content > .alert');
              if(error && error.innerTxt)
              {

              }
              let username = document.querySelector('[name=login_username]');
              let password = document.querySelector('[name=login_password]');
              let stayLoggedIn = document.querySelector('#checkbox');
              let submit = document.querySelector('[name=submit]');
              if(username && password && stayLoggedIn && submit)
              {
                clearInterval(loginInterval);
  
                username.value = '${username}';
                password.value = '${password}';
                stayLoggedIn.checked = true;
                submit.click();
              }
            }, 50);
          `.replace(/\n/g, "");
          frame.executeJavaScript(loginScript);
        }
      }
    }
  });

  startMxsWindow();
}

let lastConfig = storage.getSync('config');
if(!lastConfig.mxs)
{
  lastConfig.mxs = {};
  storage.set('config', lastConfig);
}
let lastUsername = lastConfig.mxs.username;
let lastPassword = lastConfig.mxs.password;

function startMxsWindow() {
  if(mxsWin)
  {
    mxsWin.destroy();
  }
  mxsWin = new BrowserWindow({show: false, paintWhenInitiallyHidden: true});

  mxsWin.webContents.on('did-frame-navigate', (event, url, httpResponseCode, httpStatusText, isMainFrame, frameProcessId, frameRoutingId) => {
    const frame = webFrameMain.fromId(frameProcessId, frameRoutingId);
    if (frame) {
      if (frame.url.startsWith("https://login.maximumsettings.com")) {
        let script = `
          let interval = setInterval(() => {
            if(document.head)
            {
              clearInterval(interval);

              let styleSheet = document.createElement("style");
              styleSheet.type = "text/css";

              styleSheet.innerText = 'footer {position: fixed; bottom: 0; left: 0; right: 0; text-align: center;} header {display: none !important;} main {padding-top: 40px; padding-bottom: 40px;} footer, .footer-bottom {margin-top: 0 !important; padding-top: 0 !important;} footer ul { margin-bottom: 0; }';

              document.head.appendChild(styleSheet);
            }
          }, 50);
        `.replace(/\n/g, "");
        frame.executeJavaScript(script);

        let config = storage.getSync("config");
        console.log(config);
        if (config && config.mxs.username && config.mxs.password) {
          let username = config.mxs.username;
          let password = config.mxs.password;
          let loginScript = `
            let loginInterval = setInterval(() => {
              let error = document.querySelector('#login_box > .content > .alert');
              if(error && error.innerTxt)
              {

              }
              let username = document.querySelector('[name=login_username]');
              let password = document.querySelector('[name=login_password]');
              let stayLoggedIn = document.querySelector('#checkbox');
              let submit = document.querySelector('[name=submit]');
              if(username && password && stayLoggedIn && submit)
              {
                clearInterval(loginInterval);
  
                username.value = '${username}';
                password.value = '${password}';
                stayLoggedIn.checked = true;
                submit.click();
              }
            }, 50);
          `.replace(/\n/g, "");
          frame.executeJavaScript(loginScript);
        }
      }
    }
  });

  mxsWin.loadURL('https://login.maximumsettings.com');
}

function constructFrame(frameCounter, device, chunk) {
  const sampleRateList = [6000, 12000, 24000, 48000, 96000, 192000, 384000, 8000, 16000, 32000, 64000, 128000, 256000, 512000, 11025, 22050, 44100, 88200, 176400, 352800, 705600];
  const vbanBuffer = Buffer.from("VBAN", "ascii");
  const sampleRateBuffer = Buffer.alloc(1);
  sampleRateBuffer.writeUInt8(sampleRateList.indexOf(device.defaultSampleRate));
  const chunkSizeBuffer = Buffer.alloc(1);
  chunkSizeBuffer.writeUInt8(255);
  const channelsBuffer = Buffer.alloc(1);
  channelsBuffer.writeUInt8((Math.min(2, device.maxInputChannels)));
  const codecBuffer = Buffer.alloc(1);
  codecBuffer.writeUInt8(0x01);
  const nameBuffer = Buffer.from("ShimmerStream".padEnd(16, "_").substring(0, 16), "ascii");
  const frameCounterBuffer = Buffer.alloc(4);
  frameCounterBuffer.writeUInt32LE(frameCounter, 0);

  let headerBuffer = Buffer.concat([vbanBuffer, sampleRateBuffer, chunkSizeBuffer, channelsBuffer, codecBuffer, nameBuffer, frameCounterBuffer]);

  let totalData = Buffer.concat([headerBuffer, chunk]);

  return totalData;
}

async function checkLogin() {
  if(!mxsWin)
  {
    startMxsWindow();
  }
  let script = `
    new Promise((resolve, reject) => {
      let username = document.querySelector('#username_label');
      resolve(username && username.innerText);
    });
  `.replace(/\n/g, '');

  return await mxsWin.executeJavaScript(script);
}

let micStream, micChunker, micSocket;

let interval = null

ipcMain.on('hideWindow', (event, data) => {
  console.log("Hide Window Called!");
  win.hide();

  setTimeout(() => {
    if (interval != null) {
      clearInterval(interval);
    }
    interval = setInterval(async () => {
      console.log("Checking for moonlight.");
      let processes = await psList();

      let names = processes.map(item => item.name.toLowerCase());

      if (names.includes('moonlight') || names.includes('moonlight.exe')) {
        console.log("Moonlight found!");
        return;
      }

      clearInterval(interval);
      interval = null;

      console.log("Moonlight not found, creating window.");

      win.show();
      win.focus();
    }, 5000);
  }, 5000);
})

ipcMain.on('saveConfig', (event, data) => {
  console.log("Saving config.");
  storage.set('config', data);
  if(data.mxs.username != lastUsername || data.mxs.password != lastPassword)
  {
    console.log("Username or password changed. Reloading MxS window.");
    startMxsWindow();
  }
});

ipcMain.on('startRecord', (event, data) => {
  try {
    console.log(data);
    let { device, ip } = data;
    let frameCounter = 0;
    console.log(device);
    micStream = new naudiodon.AudioIO({
      inOptions: {
        channelCount: device.maxInputChannels,
        sampleFormat: naudiodon.SampleFormat16Bit,
        sampleRate: device.defaultSampleRate,
        deviceId: device.id,
        closeOnError: true
      }
    });

    micSocket = dgram.createSocket('udp4');

    micSocket.connect(6980, ip);

    micChunker = new SizeChunker({
      chunkSize: 256
    });

    console.log("Mic Chunker Created");

    console.log("Piping Stream");

    micStream.pipe(micChunker);

    micChunker.on('data', (chunk) => {
      frameCounter++;

      let data = constructFrame(frameCounter, device, chunk.data);

      micSocket.send(data, 0, data.length, (err, bytes) => {
        if (err) {
          ipcMain.send('micError', err);

          micChunker.end();
          micSocket.close();
          micStream.quit();
        }
      });
    });

    micStream.start();
  }
  catch (err) {
    ipcMain.send('micError', err);
  }
});

ipcMain.on('endRecord', (event, data) => {
  micChunker.end();
  micSocket.close();
  micStream.quit();
});

ipcMain.on('sendPowerRequest', async (event, data) => {
  if(!checkLogin)
  {
    event.reply('notLoggedIn');
    return;
  }
  let action = data;

  let script = `
    var button = document.querySelector('.btn_${action}');
    if(button)
    {
      button.click();
      if('${action}' != 'start')
      {
        var confirmInterval = setInterval(() => {
          var confirmButton = document.querySelector('.swal2-confirm');
          if(confirmButton) {
            clearInterval(confirmInterval);
            confirmButton.click();
          }
        }, 50);
      }
    }
  `.replace(/\n/g, "");

  mxsWin.webContents.executeJavaScript(script);

  event.reply('powerRequestSent');
});

ipcMain.on('sendSnoozeRequest', async (event, data) => {
  console.log("Send Snooze Request");
  if(!checkLogin)
  {
    event.reply('notLoggedIn');
    return;
  }
  console.log("Login Fine");
  let script = `
    var buttons = document.querySelectorAll('.shutdown_snooze [data-val]');

    var button = null;
    buttons.forEach((val) => {
      console.log(val);
      console.log(val.getAttribute('data-val'));
      if(val.getAttribute('data-val') == ${data})
      {
        button = val;
      }
    });

    if(button)
    {
      button.click();
    }
  `.replace(/\n/g, "");

  console.log("Executing Snooze Request");

  mxsWin.webContents.executeJavaScript(script);

  event.reply('snoozeRequestSent');
});

ipcMain.on('sendForceShutdown', async (event, data) => {
  if(!checkLogin)
  {
    event.reply('notLoggedIn');
    return;
  }
  let script = `
    var button = document.querySelector('.force_shut_down_cls');
    if(button)
    {
      button.click();
      var confirmInterval = setInterval(() => {
        var confirmButton = document.querySelector('.swal2-confirm');
        if(confirmButton) {
          clearInterval(confirmInterval);
          confirmButton.click();
        }
      }, 50);
    }
  `.replace(/\n/g, "");

  mxsWin.webContents.executeJavaScript(script);
  event.reply('forceShutdownSent');
});

ipcMain.on('getStatus', async(event, data) => {
  let script = `
  new Promise((resolve, reject) => {
    try
    {
      var status = document.querySelector('.vm_status').innerText;
      var node = document.querySelector('.vm_node').innerText;
      var ip = document.querySelector('div.summary_info.bottom_box_shasow > div:nth-child(3) > div.col-md-6.text-right').innerText;
      var cpu = document.querySelector('.vm_cpu_usage').innerText;
      var memory_usage = document.querySelector('.vm_memory_usage').innerText;
      var remaining_time = document.querySelector('.remaining_time_container .text-right').innerText;

      resolve({
        status,
        node,
        ip,
        cpu,
        memory_usage,
        remaining_time
      })
    }
    catch(ex)
    {
      reject(ex);
    }
  });
  `.replace(/\n/g, "");

  try
  {
    let status = await mxsWin.webContents.executeJavaScript(script);
  
    event.reply('sendStatus', status);
  }
  catch(ex)
  {
    event.reply('notLoggedIn');
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
