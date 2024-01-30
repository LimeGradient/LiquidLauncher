const {ipcRenderer} = require('electron')

const homepage = document.querySelector(".homepage")
const versionPage = document.querySelector(".versions")
const serverPage = document.querySelector(".server")

const title = document.querySelector(".title")
const launchButton = document.querySelector(".launch-button")
const loginButton = document.getElementById("login-button")

window.onload = () => {
    versionPage.style.visibility = "hidden"
}

let mcVersion;

function setVersion(version) {
    mcVersion = version;
    launchButton.innerHTML = `Launch - ${version}`
    document.title = `Liquid Launcher - MC ${version}`
}

function login() {
    ipcRenderer.invoke("login")
    console.log('clicked login button')
}

document.querySelector(".launch-button").addEventListener("click", () => {
    ipcRenderer.invoke("launchGame", mcVersion);
})

document.querySelector(".loadHomePage").addEventListener("click", () => {
    homepage.style.visibility = "visible"
    versionPage.style.visibility = "hidden"
    serverPage.style.visibility = "hidden"
    title.innerHTML = "Liquid Launcher"
})

document.querySelector(".loadVersionPage").addEventListener("click", () => {
    homepage.style.visibility = "hidden"
    versionPage.style.visibility = "visible"
    serverPage.style.visibility = "hidden"
    title.innerHTML = "Versions"
})

document.querySelector(".loadServerPage").addEventListener("click", () => {
    homepage.style.visibility = "hidden"
    versionPage.style.visibility = "hidden"
    serverPage.style.visibility = "visible"
    title.innerHTML = "Server"
})

ipcRenderer.on("setSkin", async (event, profileId) => {
    loginButton.style.visibility = "hidden"
    const skinImg = document.createElement("img")
    skinImg.width = 100
    skinImg.height = 100
    skinImg.id = "skinHead"

    document.querySelector(".account-button").appendChild(skinImg)
    document.getElementById('skinHead').src = `https://mc-heads.net/avatar/${profileId}`
})

ipcRenderer.on("loggingIn", async (event) => {
    document.querySelector("#login-button").disabled = true
})

ipcRenderer.on("notLoggedIn", async (event) => {
    document.querySelector("#login-button").disabled = false
})