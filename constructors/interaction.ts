import Eris, { PingInteraction, CommandInteraction, ComponentInteraction, AutocompleteInteraction, UnknownInteraction, Client } from "eris"
import { Database } from "../index";

//I want to make the interaction system more safe and streamlined to use - so that instead of multiple events, you have a unified interaction.

class sanitaryInteraction {

    constructor(client, parentInteraction: PingInteraction | CommandInteraction | ComponentInteraction | AutocompleteInteraction | UnknownInteraction) {
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
        this.interaction = parentInteraction
        this.client = client
        

    }
    /**
     * Whether or not the interaction has been acknowledged.
     */
    readonly acknowledged: boolean = false
    readonly token: string
    private readonly applicationID: string
    private readonly interaction: any
    private readonly client

    async user() {
        if (this.interaction.member.bot) return this.interaction.member //Bots don't have rights to concede permission for GDPR
        else {
            console.log(Database.user)
            const user = await Database.user.find(this.interaction.member.id)
            if (user === null) {
                await this.interaction.createMessage({type: 64, content: "Hiya! Just for GDPR sake, do you consent for me to use process & store your data?\nIf you select no, we will be unable to run this command.", components: [
                    {
                        type: 2,
                        style: 3,
                        label: "Go Ahead!",
                        custom_id: "yes"+this.interaction.member.id,
                    },
                    {
                        type: 2,
                        style: 4,
                        label: "No Thanks.",
                        custom_id: "no"+this.interaction.member.id
                    }
                ]})
                const interactionFunction = async component => {
                    if (component.type === 3 && ["no"+this.interaction.member.id, "yes"+this.interaction.member.id].includes(component.data.custom_id)) {
                        if (component.data.custom_id.startsWith("no")) {
                            await this.interaction.editOriginalMessage("Got it. Your data will be discarded. The command may refuse to run, however.")
                            return false
                        } else {
                            await this.interaction.editOriginalMessage("Got it, Thanks! Now back to your regularily scheduled programming...")
                            await Database.user.create({ id: this.interaction.member.id })
                            return this.interaction.member
                        }
                    }
                }
                this.client.on('createInteraction', interactionFunction)
                await new Promise(r => setTimeout(r, 30000))
                this.client.removeEventListener('createInteraction', interactionFunction)
                await this.interaction.editOriginalMessage("You didn't answer in time, so we'll consider a no.")
                return false


            } else if ( !user.allowUsage ) {
                const error = new Error("I'm not permitted to make any user-processing calls!")
                error.name = "User.NoPermission"
                throw error
            } else {

            }
            //How do we verify that the user can use?
        }
    }

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

export {sanitaryInteraction}