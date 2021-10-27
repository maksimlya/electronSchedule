const { app, BrowserWindow, ipcMain } = require('electron');
const { processData } = require('./excelParser');
const path = require('path');
const { autoUpdater } = require('electron-updater');

async function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: 'icon.ico',
        webPreferences: {
            preload: path.join(__dirname, '../../preload.js'),
            nodeIntegration: true,
            contextIsolation: false
          }
})
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

autoUpdater.autoDownload = true;
autoUpdater.on('update-downloaded', () => {
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 5* 1000);
})


