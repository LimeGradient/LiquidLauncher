const path = require('path');

const { app, BrowserWindow, ipcMain } = require('electron');

const pcal = require('./util/protocol')
const mc = require('./minecraft')

const window = {
  window: null,
  get getWindow() {return this.window},
  set setWindow(win) {this.window = win}
}
exports.window = window

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  window.setWindow = mainWindow;
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

app.on('ready', () => {
  pcal.createProtocol()
  setTimeout(() => {
    createWindow()
    mc.getJavaVMS()
    ipcMain.handle("launchGame", async (event, version) => {
      mc.launchGame(version)
    })
    
    ipcMain.handle("login", (event) => {
      mc.login()
    })

    ipcMain.handle("launchServer", (event, ram) => {
      mc.launchServer(ram)
    })

    mc.checkLogin()
  }, 500)
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});