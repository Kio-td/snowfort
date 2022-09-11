const path = require('path')
const eventClass = require('../constructors/event.ts')


class GuildRoleInformer extends eventClass {
    constructor(cmd) {
        super(cmd, 
            {
                name: "GuildRoleInformer",
                description: "Uses this.msg to tell you about a guild role update.",
                listener: "guildRoleUpdate"
            }
        );
    }
    async runEvent(client, guild) {
        this.msg("New Role! :eyes")
        throw "BUT I DON'T WANT IT >:C"
    }
    async onError(client) {
        //We don't want to spook because of mean bot.
        return false
    }
    async onLoad() {
        this.msg("Hi friend!")
        this.error(":c")
    }
}

module.exports = GuildRoleInformer