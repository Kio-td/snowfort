const CommandClient = require('../constructors/slash-command')

class ping extends CommandClient {
    constructor(eris) {
        super(
            eris, {
                invoker: "ping",
                description: "Pong!",
                guildID: "1014321214803693648",
                
            }
        )
    }
    async runCommand(client) {
        this.msg("uwah ouo")
        client.createMessage("uwah")
    }
}

module.exports = ping