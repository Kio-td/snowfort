
import fs = require('fs/promises') // We're not doing Sync calls anymore, Ferny. Bonk.
import {Client as eris} from 'eris'
import { loadCommands, commandHolder } from './core/commands'
import { loadEvents } from './core/events'
// import { sanitaryInteraction } from './constructors/interaction'
import { msg } from './core/msg'
import { sanitzeScripts } from './core/sanitize'
import setup = require('./core/setup.js')
import { Database as db } from './core/database'
import { DataTypes, Sequelize } from 'sequelize'

const fileExists = async path => !!(await fs.stat(path).catch(e => false))

let client = null,
    config = null


const Database = new db()

const checkSetup = async () => {

  if ((await fileExists('./config.json')) === false) {await setup()}
  config = (await import('./config.json', {assert:{type:'json'}})).default
  msg.debug("System", "Loading Events.")
  client = new eris(config.__protected.Bot.Token, {compress: true, seedVoiceConnections: true, intents:['allNonPrivileged']})

client.on('interactionCreate', (interaction: any) => {

  //TODO: passing interaction through willy nilly is a bad idea, we should create a proper safety net.
  //SEE: constructor/interaction.ts
  // if (interaction.type !== 3) commandHolder[interaction.data.name].runCommand(client, new sanitaryInteraction(client, interaction))
  commandHolder[interaction.data.name].runCommand(interaction)
})


  
client.on('debug', d => msg.debug("Eris", d))

client.on('ready', async () => {
   msg.info("Eris", "Ready as " + client.user.username + "#" + client.user.discriminator)
   loadCommands(client, config)
})
  
  
  
  await loadEvents(client, config)
  await client.connect()

}

checkSetup()

msg.info("System", "Starting, Please wait...")
msg.debug("System", "Verifying setup process.")

export {msg, sanitzeScripts, Database}