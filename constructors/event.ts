import Eris = require('eris')
 
abstract class event {
    constructor(
        client: Eris.Client,

        options: {
            name: string,
            description: string,
            listener: "channelCreate" | "channelDelete" | "channelPinUpdate" | "channelUpdate" | "connect" | "guildAvailable" | "guildBanAdd" | "guildBanRemove" |
            "guildCreate" | "guildDelete" | "guildEmojisUpdate" | "guildMemberAdd" | "guildMemberRemove" | "guildMemberUpdate" | "guildRoleCreate" |
            "guildRoleDelete" | "guildRoleUpdate" | "guildStickersUpdate" | "guildUnavailable" | "guildUpdate" | "inviteCreate" | "inviteDelete" |
            "unavailableGuildCreate" | "unknown" | "userUpdate" | "warn" | "webhooksUpdate"
        }
        ) {
            this.client = client
            this.name = options.name
            this.description = options.description
            this.listener = options.listener
    }
    readonly type = "event"
    readonly name: string
    readonly description: string = "Looks like this event does not have a description yet."
    readonly listener: "channelCreate" | "channelDelete" | "channelPinUpdate" | "channelUpdate" | "connect" | "guildAvailable" | "guildBanAdd" | "guildBanRemove" |
              "guildCreate" | "guildDelete" | "guildEmojisUpdate" | "guildMemberAdd" | "guildMemberRemove" | "guildMemberUpdate" | "guildRoleCreate" |
              "guildRoleDelete" | "guildRoleUpdate" | "guildStickersUpdate" | "guildUnavailable" | "ready" | "guildUpdate" | "inviteCreate" | "inviteDelete" |
              "unavailableGuildCreate" | "unknown" | "userUpdate" | "warn" | "webhooksUpdate";
              // I've removed all user-account events, as well as privileged intents.
              // Anything regarding listening for messages, or deleting them, have been removed.
    readonly client: Eris.Client
    
    protected msg(msg: string) :void {
        console.log("[\x1b[92m"+new Date().toLocaleString()+"\x1b[0m][\x1b[34mInfo\x1b[0m][E \x1b[32m" + this.name + "\x1b[0m] - " + msg.toString())
    }
    protected error(msg: string): void {
        console.error("[\x1b[92m"+new Date().toLocaleString()+"\x1b[0m][\x1b[91mError\x1b[0m][E \x1b[32m" + this.name + "\x1b[0m] - " + msg.toString())
    }
    abstract runEvent(client: Eris.Client, ...args: any[]): Promise<void | boolean | Error>

    async onError(client: Eris.Client, error: Error): Promise<void | boolean> {
        // If an error is made, then the client will try and run this.
        this.error(error.message)
    }
    abstract onLoad?(client: Eris.Client | null | undefined): Promise<void | boolean>
}

// exports.Event = event
module.exports = event