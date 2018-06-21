const {app, BrowserWindow, Menu, protocol, ipcMain} = require('electron')
const log = require('electron-log')
const {autoUpdater} = require('electron-updater')
const path = require('path')
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
  : `file://${__dirname}/index.html#v${app.getVersion()}`
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
  // win.webContents.openDevTools()
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
  setTimeout(function () {
    autoUpdater.quitAndInstall()
  }, 5000)
})
app.on('ready', function () {
  createDefaultWindow()
})
app.on('window-all-closed', () => {
  app.quit()
})
ipcMain.on('checkVersion', (event) => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
ipcMain.on('close', (event) => {
  win.close()
})
ipcMain.on('minimize', (event) => {
  win.minimize()
})
