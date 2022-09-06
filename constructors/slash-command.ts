import Eris from "eris"
const Command = require("./command")

abstract class slashCommand extends Command {
    constructor(
        client: Eris.Client,
        /**
         * The main options for a slashCommand
         */
        options: {
            /**
             * what users will use to run the command.
             * Only [a-z]<=32 is accepted.
             */
            invoker: string,
            /**
             * a description of the command, as seen by the user. should be set to null if you're using localized descriptions.
             * @required
             */
            description: string,
            /**
             * localized descriptions of the command, as seen by users. should be set to null if you're using a singular description.
             */
            localizedDescriptions?: {},
            /**
             * if a guildID is set, then the command will be locked to a specific guild.
             * useful for avoiding cache issues.
             */
            guildID?: string,
            /**
             * Help command specifics.
             */
            help: {
                /**
                 * should this command show up in help at all?
                 */
                hidden?: boolean
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
                    longDescription: string,
                    /**
                     * the short description, or the summary.
                     */
                    shortDescription: string
                },
                /**
                 * A category name, if it has any. This will show up in the help command.
                 * if null, the command will listed as uncategorized.
                 */
                category?: string,
            },
            /**
             * The Discord Application Command Options.
             * @see https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure .
             */
            options?: {}
        }
    ) {
        super({
            name: options.invoker,
            help: options.help,
            type: 1
        })
        this.invoker = options.invoker
        this.description = options.description
        this.guildID = options.guildID
        this.options = options.options


    }
    readonly invoker: string
    readonly description: string
    readonly options?: {}

    abstract autoComplete?(client: Eris.Client, params?: {}): Promise<void>
}

module.exports = slashCommand