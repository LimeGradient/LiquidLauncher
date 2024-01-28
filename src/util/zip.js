const fs = require('fs')
const path = require('path')
const decompress = require("decompress")
const archiver = require("archiver")

function zipFolder(path, zip, callback) {
    const output = fs.createWriteStream(zip)
    const archive = archiver('zip', {zlib: {level: 9}})
    output.on('close', () => {
        callback()
    })

    archive.pipe(output)
    archive.directory(path, '')
    archive.finalize()
}

function unzipFolder(zip, path) {
    decompress(zip, path).then((files) => {
        console.log(files)
    }).catch((err) => {
        console.error(err)
    })
}

exports.zipFolder = zipFolder
exports.unzipFolder = unzipFolder