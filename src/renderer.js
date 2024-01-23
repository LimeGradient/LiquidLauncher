const {ipcRenderer} = require('electron')

ipcRenderer.on('loadBgImage', async (event, path) => {
    document.querySelector(".bg-image").style.backgroundImage = `url(launcher://${path})`
    console.log("Background Image Set")
})

document.querySelector(".launch-button").addEventListener("click", () => {
    ipcRenderer.invoke("launchGame");
})

ipcRenderer.on("setSkin", async (event, profileId) => {
    const skinImg = document.createElement("img")
    skinImg.width = 100
    skinImg.height = 100
    skinImg.id = "skinHead"
    
    document.getElementById('skinHead').src = `https://mc-heads.net/avatar/${profileId}`
})