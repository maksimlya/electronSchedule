const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '../../preload.js'),
            nodeIntegration: true,
            contextIsolation: false
          }
})

win.loadFile(path.join(__dirname, '../../dist/index.html'));
}

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

app.whenReady().then(() => {
    createWindow()
})
