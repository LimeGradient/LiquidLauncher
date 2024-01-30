const { Client } = require('minecraft-launcher-core')
const { Auth } = require('msmc')
const {readdir, rename} = require("fs/promises")

const fs = require('fs')
const path = require('path')

const win = require("./index")
const zip = require('./util/zip')

const token = {
    token: null,

    get getToken() { return this.token },
    set setToken(t) { this.token = t },
}

const mc_data = {
    data: [],
    java: null
}

const javaVMS = []

async function checkLogin() {
    win.window.getWindow.webContents.send("loggingIn");
    fs.readFile(path.join(__dirname, "data/mc.json"), async (err, file) => {
        if (err) {
            console.log("No MC Token Found")
            return
        }
        if (file.length == 0) {
            win.window.getWindow.webContents.send("notLoggedIn");
            return
        } else {
            const json_data = JSON.parse(file)
            const authManager = new Auth("login")
            authManager.refresh(json_data.data[0].token).then(async xboxManager => {
                const xbx = await xboxManager.getMinecraft()
                token.setToken = await xboxManager.getMinecraft()
                win.window.getWindow.webContents.send("setSkin", xbx.profile.id)
            }).catch((err) => {
                if (err['response']['status'] == 429) {
                    console.error(err['response']['status'])
                }
            })
        }
    })
}

function login() {
    win.window.getWindow.webContents.send("loggingIn");
    if (!fs.existsSync(path.join(__dirname, "data"))) {
        fs.mkdirSync(path.join(__dirname, "data"))
    }
    if (!fs.existsSync(path.join(__dirname, "data/mc.json"))) {
        fs.writeFile(path.join(__dirname, "data/mc.json"), "", err => {
            if (err) throw err;
        })
    }
    const authManager = new Auth("select_account")
    authManager.launch("raw").then(async xboxManager => {
        const xbx = await xboxManager.getMinecraft()
        mc_data.data.push({ token: xboxManager.msToken, id: xbx.profile.id })
        token.setToken = await xboxManager.getMinecraft()
        fs.writeFile(path.join(__dirname, "data/mc.json"), JSON.stringify(mc_data), 'utf8', err => { if (err) throw err; })
        console.log(xbx.profile.id)
        win.window.getWindow.webContents.send("setSkin", xbx.profile.id)
    }).catch((err) => {
        if (err) throw err;
    })
}

function getJavaVMS() {
    const getJavaVM = async source => (await readdir(source, {withFileTypes: true})).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)
    if (process.platform === "darwin") {
        getJavaVM("/Library/Java/JavaVirtualMachines/").then((dirs) => {
            for (const dir of dirs) {
                if (dir.includes("1.8") || dir.includes("17") || dir.includes("18") || dir.includes("19")) {
                    const jvmpath = path.join("/Library/Java/JavaVirtualMachines/", dir, "/Contents/Home/bin/java")
                    javaVMS.push(jvmpath)
                    console.log(`Java Path: ${jvmpath}`)
                }
            }
        })
    }
    if (process.platform === "win32") {
        getJavaVM("C:\\Program Files (x86)\\Java").then((dirs) => {
            for (const dir of dirs) {
                if (dir.includes("1.8")) {
                    javaPath = path.join("C:\\Program Files (x86)\\Java", dir, "\\bin\\java.exe")
                    console.log(`[Lime]: Set Java Path to ${javaPath}`)
                }
            }
        }).catch((err) => {
            getJavaVM("C:\\Program Files\\Java").then((dirs) => {
                for (const dir of dirs) {
                    if (dir.includes("1.8")) {
                        javaPath = path.join("C:\\Program Files\\Java", dir, "\\bin\\java.exe")
                        console.log(`[Lime]: Set Java Path to ${javaPath}`)
                    }
                }
            })
        })
    }
}

function launchGame(version) {
    const launcher = new Client()

    const getVersionCache = async source => (await readdir(source, {withFileTypes: true})).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)
    if (!fs.existsSync(path.join(__dirname, "cache"))) {
        fs.mkdirSync(path.join(__dirname, "cache"))
        fs.mkdirSync(path.join(__dirname, "minecraft"))
    }
    // fs.rmSync(path.join(__dirname, "minecraft"), {recursive: true, force: true})
    console.log(token.getToken)

    let opts = {
        clientPackage: null,
        authorization: token.getToken.mclc(),
        root: path.join(__dirname, "minecraft"),
        version: {
            number: version,
            type: "release",
        },
        memory: {
            max: "6G",
            min: "4G",
        },
        javaPath: "",
    }

    getVersionCache(path.join(__dirname, "cache")).then((dirs) => {
        for (const dir of dirs) {
            if (dir.includes(version)) {
                fs.rename(path.join(__dirname, `cache/minecraft-${version}`), path.join(__dirname, "minecraft"), (err) => {
                    if (err) throw err
                    console.log("Successfully got Minecraft from Cache")
                })
            }
        }
    })

    if (fs.existsSync(path.join(__dirname, `cache/minecraft-${version}.zip`))) {
        // zip.unzipFolder(path.join(__dirname, `cache/minecraft-${version}.zip`), path.join(__dirname, "minecraft"))
    }

    console.log(parseFloat(version))

    if (version === "1.18" || version === "1.19" || version === "1.20") {
        javaVMS.forEach(vm => {
            if (vm.includes("19"))
                opts.javaPath = vm
        })
    } else {
        javaVMS.forEach(vm => {
            if (vm.includes("1.8"))
                opts.javaPath = vm
        })
    }

    launcher.launch(opts)

    launcher.on("debug", (e) => console.log(e));
    launcher.on("data", (e) => console.log(e));
    launcher.on("close", (e) => {
        fs.rename(path.join(__dirname, "minecraft"), path.join(__dirname, `cache/minecraft-${version}`), (err) => {
            if (err) console.log("Launcher Tried Caching Minecraft Twice. Stopping...")
            console.log("Successfully cached Minecraft")
        })
        fs.rm(path.join(__dirname, "minecraft"), {recursive: true, force: true}, (err) => {
            if (err) console.log("Launcher Tried Caching Minecraft Twice. Stopping..")
        })
        /* zip.zipFolder(path.join(__dirname, `cache/minecraft-${version}`), path.join(__dirname, `cache/minecraft-${version}.zip`), (err) => {
            fs.rm(path.join(__dirname, `cache/minecraft-${version}`, {recursive: true, force: true}, (err) => {
                if (err) console.error(err)
            }))
        }) */
    })
}

exports.login = login
exports.launchGame = launchGame
exports.getJavaVMS = getJavaVMS
exports.checkLogin = checkLogin