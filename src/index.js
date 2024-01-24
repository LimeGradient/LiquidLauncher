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
  const bgImages = ["buzzybees", "cats_and_pandas", "caves_and_cliffs_1", "caves_and_cliffs_2", "nether_update", "trails_and_tales", "update_aquatic", "village_and_pillage", "warden", "wild_update"]
  mainWindow.webContents.send("loadBgImage", path.join(__dirname, `img/${bgImages[Math.floor(Math.random() * bgImages.length) - 1]}.png`))
};

app.on('ready', () => {
  pcal.createProtocol()
  setTimeout(() => {
    createWindow()
    mc.getJavaVMS()
    ipcMain.handle("launchGame", async (event, version) => {
      mc.launchGame(version)
    })
  
    mc.login()
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