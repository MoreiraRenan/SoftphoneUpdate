'use strict'

import { app, protocol, BrowserWindow, ipcMain  } from 'electron'
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
import log from 'electron-log';
import {autoUpdater} from 'electron-updater';

console.log(app.getVersion())
var data = new Date(),
dia  = data.getDate().toString(),
diaF = (dia.length == 1) ? '0'+dia : dia,
mes  = (data.getMonth()+1).toString(),
mesF = (mes.length == 1) ? '0'+mes : mes,
anoF = data.getFullYear();
var name_file =  diaF+"_"+mesF+"_"+anoF+"_log.log";
log.transports.file.fileName =name_file;

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

ipcMain.on('log-info', (event, arg) => {
   log.info(arg);
})

ipcMain.on('log-error', (event, arg) => {
  log.error(arg);
})

ipcMain.on('log-warn', (event, arg) => {
  log.warn(arg);
})

ipcMain.on('win-show', (event, arg) => {
  console.log(arg)
  win.show()
})
const gotTheLock = app.requestSingleInstanceLock()


// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 350, height: 690,resizable: false, webPreferences: {
    // Use pluginOptions.nodeIntegration, leave this alone
    // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
    nodeIntegration: true,
    nodeIntegrationInWorker: true
  }})
   win.setMenuBarVisibility(false)
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
    log.info('Saindo do Aplicativo');
    win = null
   
  })

  autoUpdater.checkForUpdatesAndNotify();
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
// criando um aquivo de log por dia.
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


if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  // Create myWindow, load the rest of the app, etc...
  app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      // Install Vue Devtools
      // Devtools extensions are broken in Electron 6.0.0 and greater
      // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
      // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
      // If you are not using Windows 10 dark mode, you may uncomment these lines
      // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
      // try {
      //   await installVueDevtools()
      // } catch (e) {
      //   console.error('Vue Devtools failed to install:', e.toString())
      // }
  
    }
    createWindow()
  })
}
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
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

autoUpdater.on('update-available', () => {
  // win.webContents.send('update_available');

});
autoUpdater.on('update-downloaded', () => {
  // win.webContents.send('update_downloaded');
  autoUpdater.quitAndInstall();
});

// Exit cleanly on request from parent process in development mode.

