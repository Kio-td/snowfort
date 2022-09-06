import { PingInteraction, CommandInteraction, ComponentInteraction, AutocompleteInteraction, UnknownInteraction } from "eris"

//I want to make the interaction system more safe and streamlined to use - so that instead of multiple events, you have a unified interaction.

class interaction {

    constructor(parentInteraction: PingInteraction | CommandInteraction | ComponentInteraction | AutocompleteInteraction | UnknownInteraction) {
        switch (parentInteraction.constructor) {

            case PingInteraction:

                break;
            case CommandInteraction:

                break;
            case ComponentInteraction:

                break;
            case AutocompleteInteraction:

                break;
            case UnknownInteraction:

                break;
        }
        this.acknowledged = parentInteraction.acknowledged
        this.token = parentInteraction.token //Should I remove this?
        this.applicationID = parentInteraction.applicationID //Should probably remove this.

    }
    /**
     * Whether or not the interaction has been acknowledged.
     */
    readonly acknowledged: boolean = false
    readonly token: string
    private readonly applicationID: string


    // //Commands here.
    // async send(message: string | {
    //     allowedMentions?: {
    //         everyone?: boolean,
    //         roles?: boolean | Array<String>,
    //         users?: boolean | Array<String>,
    //     }
    //     components?: {
    //         custom_id?: string,
    //         disabled?: boolean,
    //         emoji?: boolean,

    //     } | Array<{}>
    // }): Promise<void> {

    // }



}

module.exports = interaction