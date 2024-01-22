const {ipcRenderer} = require('electron')

ipcRenderer.on('loadBgImage', async (event, path) => {
    document.querySelector(".bg-image").style.backgroundImage = `url(launcher://${path})`
    console.log("Background Image Set")
})