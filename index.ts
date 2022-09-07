
import path = require('path')
import fs = require('fs/promises') // We're not doing Sync calls anymore, Ferny. Bonk.
import {Client as eris} from 'eris'
import { loadCommands, commandHolder } from './core/commands'
import { loadEvents } from './core/events'
import { sanitaryInteraction } from './constructors/interaction'
import { msg } from './core/msg'

// We'll be using a config.json, and using sanity checks to prevent usage of it.                             
// Initialize .env into memory
// require('dotenv').config()

//Create and prepare clients
const client = new eris(process.env.TOKEN, {compress: true, seedVoiceConnections: true, intents:['allNonPrivileged']})


client.on('interactionCreate', (interaction: any) => {
  //TODO: passing interaction through willy nilly is a bad idea, we should create a proper safety net.
  //SEE: constructor/interaction.ts
  commandHolder[interaction.data.name].runCommand(new sanitaryInteraction(interaction))

})



client.on('ready', async () => {
   msg.info("Eris", "Ready as " + client.user.username + "#" + client.user.discriminator)
   loadCommands(client)
})

msg.info("System", "Starting, Please wait...")
msg.debug("System", "Verifying setup process.")

msg.debug("System", "Loading Events.")
loadEvents(client).then(client.connect)

