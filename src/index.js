const path = require('path');

const { app, BrowserWindow, ipcMain } = require('electron');

const pcal = require('./protocol')
const mc = require('./minecraft')

if (require('electron-squirrel-startup')) {
  app.quit();
}

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

app.on('ready', async () => {
  createWindow()
  pcal.createProtocol()
  window.getWindow.webContents.send("loadBgImage", path.join(__dirname, "img/world_of_color.png"))
  mc.login()

  ipcMain.handle("launchGame", async (event) => {
    mc.launchGame()
  })
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