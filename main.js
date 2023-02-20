const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: __dirname + '/icon.ico',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    }
  });

  mainWindow.loadURL("https://lichess.org/");

  electron.globalShortcut.register('Ctrl+O', () => {
    mainWindow.setFullScreen(!mainWindow.isFullScreen())
  })

  electron.globalShortcut.register('Ctrl+G', () => {
    mainWindow.webContents.executeJavaScript(`
      document.querySelectorAll('.notifs').forEach((notif) => notif.style.display = 'none');
    `);
  });
  
  
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
