const path = require('path')
const {ipcMain, app, Menu, Tray} = require('electron')

let appIcon = null

ipcMain.on('put-in-tray', (event) => {
  const iconPath = process.env.NODE_ENV === 'development' ? path.join(__dirname, '../../../static/icon.ico') : path.join(__dirname, 'static/icon.ico')
  appIcon = new Tray(iconPath)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    },
    {
      label: '移除',
      click: () => {
        event.sender.send('tray-removed')
      }
    }
  ])

  appIcon.setToolTip('Electron Demo in the tray.')
  appIcon.setContextMenu(contextMenu)
})

ipcMain.on('remove-tray', () => {
  appIcon.destroy()
})

app.on('window-all-closed', () => {
  if (appIcon) appIcon.destroy()
})
