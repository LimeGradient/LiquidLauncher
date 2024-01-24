const {ipcRenderer} = require('electron')

ipcRenderer.on('loadBgImage', async (event, path) => {
    document.querySelector(".bg-image").style.backgroundImage = `url(launcher://${path})`
    
    setTimeout(() => {
        document.querySelector(".bg-image").style.backgroundImage = `url(launcher://${path})`
    }, 500)
})

document.querySelector(".launch-button").addEventListener("click", () => {
    const mcVersion = document.getElementById("versions").value
    ipcRenderer.invoke("launchGame", mcVersion);
})

ipcRenderer.on("setSkin", async (event, profileId) => {
    const skinImg = document.createElement("img")
    skinImg.width = 100
    skinImg.height = 100
    skinImg.id = "skinHead"

    document.querySelector(".account-button").appendChild(skinImg)
    document.getElementById('skinHead').src = `https://mc-heads.net/avatar/${profileId}`
})