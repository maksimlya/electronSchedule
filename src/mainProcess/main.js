const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { processData } = require('./excelParser');
const log = require('electron-log');
const path = require('path');
const { autoUpdater } = require('electron-updater');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');
let win;

let template = []
  // OS X
  const name = app.getName();
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
        click() { app.quit(); }
      },
    ]
  })


async function createWindow () {
  autoUpdater.checkForUpdatesAndNotify();
   // Create the Menu
   const menu = Menu.buildFromTemplate(template);
   Menu.setApplicationMenu(menu);

    win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: 'icon.ico',
        webPreferences: {
            preload: path.join(__dirname, '../../preload.js'),
            nodeIntegration: true,
            contextIsolation: false
          }
})
 // win.webContents.openDevTools();
  win.setMenu(null);

  // win.loadURL('http://localhost:1111');
  win.loadFile(path.join(__dirname, '../../dist/index.html'));


  win.on('ready-to-show', () => {
    win.show();
  })

  ipcMain.on('dataready', async (event, payload) => {
    processData(payload);
  })
  ipcMain.on('restart', () => {
    app.relaunch();
    app.quit();
  });
}

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

app.on('ready', createWindow);


