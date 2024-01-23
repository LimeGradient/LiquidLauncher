const { Client } = require('minecraft-launcher-core')
const { Auth } = require('msmc')

const fs = require('fs')
const path = require('path')

const win = require("./index")

const token = {
    token: null,

    get getToken() { return this.token },
    set setToken(t) { this.token = t },
}

const mc_data = {
    data: []
}

const launcher = new Client()

async function login() {
    if (!fs.existsSync(path.join(__dirname, "data"))) {
        fs.mkdirSync(path.join(__dirname, "data"))
    }
    if (!fs.existsSync(path.join(__dirname, "data/mc.json"))) {
        fs.writeFile(path.join(__dirname, "data/mc.json"), "", err => {
            if (err) throw err;
        })
    }
    fs.readFile(path.join(__dirname, "data/mc.json"), async (err, file) => {
        if (file.length == 0) {
            const authManager = new Auth("select_account")
            authManager.launch("raw").then(async xboxManager => {
                const xbx = await xboxManager.getMinecraft()
                mc_data.data.push({ token: xboxManager.msToken, id: xbx.profile.id })
                token.setToken = await xboxManager.getMinecraft()
                fs.writeFile(path.join(__dirname, "data/mc.json"), JSON.stringify(mc_data), 'utf8', err => { if (err) throw err; })
                win.window.getWindow.webContents.send("setSkin", xbx.profile.id)
            })
        } else {
            const json_data = JSON.parse(file)
            const authManager = new Auth("login")
            authManager.refresh(json_data.data[0].token).then(async xboxManager => {
                const xbx = await xboxManager.getMinecraft()
                token.setToken = await xboxManager.getMinecraft()
                win.window.getWindow.webContents.send("setSkin", xbx.profile.id)
            })
        }
    })
}

function launchGame() {
    console.log(token.getToken)
    let opts = {
        clientPackage: null,
        authorization: token.getToken.mclc(),
        root: path.join(__dirname, "minecraft"),
        version: {
            number: "1.8.9",
            type: "release",
        },
        memory: {
            max: "6G",
            min: "4G",
        },
    }

    launcher.launch(opts)

    launcher.on("debug", (e) => console.log(e));
    launcher.on("data", (e) => console.log(e));
}

exports.login = login
exports.launchGame = launchGame