const {app, BrowserWindow, Menu, protocol, ipcMain} = require('electron')
const log = require('electron-log')
const {autoUpdater} = require('electron-updater')

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
function sendStatusToWindow (text) {
  log.info(text)
  win.webContents.send('message', text)
}
function createDefaultWindow () {
  win = new BrowserWindow()
  win.webContents.openDevTools()
  win.on('closed', () => {
    win = null
  })
  win.loadURL(winURL)
  return win
}
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...')
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.')
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.')
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err)
})
autoUpdater.on('download-progress', (progressObj) => {
  let message = 'Download speed: ' + progressObj.bytesPerSecond
  message = message + ' - Downloaded ' + progressObj.percent + '%'
  message = message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  sendStatusToWindow(message)
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded')
  setTimeout(function () {
    autoUpdater.quitAndInstall()
  }, 50000)
})
app.on('ready', function () {
  // Create the Menu
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
