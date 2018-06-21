import db from '../renderer/assets/common/js/datastore'
const {app, BrowserWindow, Menu, ipcMain, protocol, Tray} = require('electron')
const log = require('electron-log')
const {autoUpdater} = require('electron-updater')
const path = require('path')
if (!db.has('appInfo').value()) {
  db.defaults({ posts: [], appInfo: {}, count: 0 }).write()
  let version = app.getVersion()
  db.set('appInfo', {
    outerVersion: version,
    appId: 1,
    innerVersion: 1
  }).write()
}
let appIcon = null
app.on('window-all-closed', () => {
  if (appIcon) appIcon.destroy()
})

// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

// Define the menu
//
// THIS SECTION IS NOT REQUIRED
let template = []
if (process.platform === 'darwin') {
  // OS X
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click () { app.quit() }
      }
    ]
  })
}
let win
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
function sendStatusToWindow (state, text) {
  log.info(text)
  win.webContents.send('message', state, text)
}
function createDefaultWindow () {
  win = new BrowserWindow({
    width: 600,
    height: 460,
    frame: false
  })
  win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })
  win.loadURL(winURL)
  return win
}
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow(0, 'Checking for update...')
})
autoUpdater.on('update-available', (info) => {
  let updateInfo = info.version + ',' + info.files[0].size + ',' + info.detail
  sendStatusToWindow(1, updateInfo)
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow(2, 'Update not available.')
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow(5, 'Error in auto-updater. ' + err)
})
autoUpdater.on('download-progress', (progressObj) => {
  let message = 'Download speed: ' + progressObj.bytesPerSecond
  message = message + ' - Downloaded ' + progressObj.percent + '%'
  message = message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  let percent = progressObj.percent
  percent = Math.round(percent)
  let info = percent + ',' + progressObj.total
  sendStatusToWindow(3, info)
  // let percent = progressObj.percent + '%'
  // log.info(percent)
  // win.webContents.send('progress', percent)
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow(4, 'Update downloaded')
  autoUpdater.quitAndInstall()
})
app.on('ready', function () {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  createDefaultWindow()
})
app.on('window-all-closed', () => {
  app.quit()
})
ipcMain.on('checkVersion', (event) => {
  autoUpdater.checkForUpdates()
})
ipcMain.on('close', (event) => {
  win.close()
})
ipcMain.on('minimize', (event) => {
  win.minimize()
})
// ipcMain.on('get-app-path', (event) => {
//   event.sender.send('got-app-path', app.getAppPath())
// })
ipcMain.on('get-app-version', (event) => {
  event.sender.send('got-app-version', app.getVersion())
})
require('./main-process/tray')
