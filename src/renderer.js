const {ipcRenderer} = require('electron')

const homepage = document.querySelector(".homepage")
const versionPage = document.querySelector(".versions")

window.onload = () => {
    versionPage.style.visibility = "hidden"
}

let mcVersion;

ipcRenderer.on('loadBgImage', async (event, path) => {
    // document.querySelector(".bg-image").style.backgroundImage = `url(launcher://${path})`
    
    setTimeout(() => {
        // document.querySelector(".bg-image").style.backgroundImage = `url(launcher://${path})`
    }, 500)
})

function setVersion(version) {
    mcVersion = version;
}

document.querySelector(".login-button").addEventListener("click", () => {
    ipcRenderer.invoke("login");
})

document.querySelector(".launch-button").addEventListener("click", () => {
    ipcRenderer.invoke("launchGame", mcVersion);
})

document.querySelector(".loadHomePage").addEventListener("click", () => {
    homepage.style.visibility = "visible"
    versionPage.style.visibility = "hidden"
})

document.querySelector(".loadVersionPage").addEventListener("click", () => {
    homepage.style.visibility = "hidden"
    versionPage.style.visibility = "visible"
})

ipcRenderer.on("setSkin", async (event, profileId) => {
    document.querySelector(".login-button").style.visibility = "hidden"
    const skinImg = document.createElement("img")
    skinImg.width = 100
    skinImg.height = 100
    skinImg.id = "skinHead"

    document.querySelector(".account-button").appendChild(skinImg)
    document.getElementById('skinHead').src = `https://mc-heads.net/avatar/${profileId}`
})

ipcRenderer.on("loggingIn", async (event) => {
    document.querySelector(".login-button").disabled = true
})

ipcRenderer.on("notLoggedIn", async (event) => {
    document.querySelector(".login-button").disabled = false
})