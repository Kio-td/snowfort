import Eris = require("eris")

abstract class Command {
    constructor(options: {
        name: string,
        guildID?: string,
        defaultPermission?: boolean,
        type: number,
        help?: {
            /**
             * should this command show up in help at all?
             */
            hidden?: boolean,
            /**
             * the name of the command, seen by help.
             * if not given, then the name of the command will be what "invoker" is set to.
             * @see invoker 
             */
            name?: string,
            /**
             * the description. either a string (Which will be the command's short & long description),
             * or an object with the long and short description seperated.
             */
            description?: string | {
                /**
                 * the long description, as seen by typing "/help <commandname>."
                 * @required
                 */
                long: string,
                /**
                 * the short description, or the summary.
                 */
                short: string
            },
            /**
             * A category name, if it has any. This will show up in the help command.
             * if null, the command will listed as uncategorized.
             */
            category?: string,
        }

    }) {
        this.name = options.name
        this.guildID = options.guildID
        this.type = options.type
        this.help = options.help
        
    }
    readonly name: string
    readonly guildID?: string
    readonly type: number
    readonly help: {}
    readonly options: any
    protected msg(msg: string) :void {
        console.log("[\x1b[92m"+new Date().toLocaleString()+"\x1b[0m][\x1b[34mInfo\x1b[0m][C \x1b[32m" + this.name + "\x1b[0m] - " + msg.toString())
    }
    protected error(msg: string): void {
        console.error("[\x1b[92m"+new Date().toLocaleString()+"\x1b[0m][\x1b[91mError\x1b[0m][C \x1b[32m" + this.name + "\x1b[0m] - " + msg.toString())
    }

    /**
     * onError - runs when an error has been detected by Eris.
     * @param client - A direct passthrough of Eris to the error.
     */
    async onError(client: Eris.Client, error: Error): Promise<string | boolean | void> {
        this.error("Looks like we're messing up. Sorry. >>");
    }
    /**
     * runCommand - runs when the command has been invoked.
     * @param client - A direct passthrough of the Eris client to the function.
     * @param params - Paramaters, if any.
     */
    abstract runCommand(client: Eris.Client, params?: {}): Promise<string | {text: string, hidden?: boolean} | void>

}

export {Command}