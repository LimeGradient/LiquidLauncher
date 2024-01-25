const {protocol} = require('electron')

function createProtocol() {
    const protocolName = "launcher"
    protocol.registerFileProtocol(protocolName, (request, callback) => {
        const url = request.url.replace(`${protocolName}://`, '')
        try {
            return callback(decodeURIComponent(url))
        } catch (err) {
            console.error(err)
        }
    })
}

exports.createProtocol = createProtocol