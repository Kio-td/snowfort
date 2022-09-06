import Eris from "eris"
const config = require('./config.json')
const path = require('path')
const eventClass = require('./constructors/event')
const commandClass = require('./constructors/command')
const fs = require('fs/promises') // We're not doing Sync calls anymore, Ferny. Bonk.
const eris = require('eris') // Eris has a lighter footprint then DJS, which is why I make it my preferred choice. 
                             // I prefer using it, especially if we're making a basic bot that only does passthru to /C.

//Initialize .env into memory
require('dotenv').config()

//Create and prepare clients
const client = new eris(process.env.TOKEN, {compress: true, seedVoiceConnections: true})

const cleanSnowfort = async (type: "event" | "command", location: string): Promise<boolean> => {

  const file = await fs.readFile(location, ('utf-8'))

  if (file.toLowerCase().includes("console.log")) {
    msg.error("SFSanity", "Console.log was found; changing to msg.info to help with logging.")
    
  }
  if (file.toLowerCase().includes("console.log") || file.toLowerCase().includes("console.error") || file.toLowerCase().includes("console.warn")) {
    msg.error("SFSanity", "console logger (debug, log, warn, error) was found; changing to msg.warn to help with logging.")
    file.replaceAll(/console.log/ig, "msg.info")
    file.replaceAll(/console.warn/ig, "msg.warn")
    file.replaceAll(/console.error/ig, "msg.error")

  }

  //if all the conditions are met, we'll give it a thumbs up.
  return true
}



// Our main Event Holder. Not to be persistant - just to retrieve information about the modules.
let eventHolder : any = {}

// I've created a new event constructor that'll allow us to know what we're running. ouo
const loadEvents = async () => {
  if (typeof config.disableSanitizer !== "undefined" && config.disableSanitizer === true)
    msg.error("System", "\n" + "=+".repeat(21) + "\n\x1b[5m\x1b[4m\x1b[31mHEY!\x1b[0m\nYou've disabled the script sanitizer, which re-enables certain parts of JS that bad actors use!\n"+
    "If some 3rd party requests you turn it off to use their script, they're not very good at coding, or they're trying to infect you with a virus.\n" +
    "Any coder worth their grain in salt can comply with the simpler APIs that we provide, that protect you!\n" +
    "We really suggest turning it off if you don't like big warnings!\n" + "=+".repeat(21) + "\n(Sleeping for 7 seconds)")
    await new Promise(resolve => setTimeout(resolve, 7000));
  msg.info("Event Handler", "Loading Events, please wait...")
  const eventsPath = path.join(__dirname, 'events')
  const eventFiles = await (await fs.readdir(eventsPath)).filter(function (file : string) { return file.endsWith(".js")})
  for await (const file of eventFiles) {
    const event: typeof eventClass = require(path.join(eventsPath, file))
    eventHolder[file] = new event(client)
    await eventHolder[file].onLoad()
    client.on(eventHolder[file].listener, eventHolder[file].runEvent)
    msg.info("Event Handler", "Added " + eventHolder[file].name + ".")
  }
  msg.info("Event Handler", "Finished Loading Events.")
}

let commandHolder : any = {}
const loadCommands = async () => {
  msg.info("Command Handler", "Loading Commands, please wait...")
  const commandPath = path.join(__dirname, 'commands')
  const commandFiles =  await(await fs.readdir(commandPath)).filter(function (file: string) { return file.endsWith(".js")})
  for await (const file of commandFiles) {

    //This is where we sanitize our scripts.
     if (typeof config.disableSanitizer !== "undefined" || config.disableSanitizer === false)
      if (!await cleanSnowfort("command", path.join(commandPath, file))) return false

    const command: typeof commandClass = require(path.join(commandPath,file))
    const cmd = new command(client)
    commandHolder[cmd.name] = cmd
    if (commandHolder[cmd.name].type === 1) {
      //Some additional checks need to be preformed here.
    } else {
      if (commandHolder[cmd.name].description === undefined ||
        commandHolder[cmd.name].options === undefined) {
          msg.error("Command Handler", "Command " + cmd.name + " cannot be added; It's not a CHAT_INPUT type, but still has a description or options.")
          continue
        }
    }

    if (typeof commandHolder[cmd.name].onLoad === "function") await commandHolder[cmd.name].onLoad(client)
    if (commandHolder[cmd.name].guildID !== undefined) await client.createGuildCommand(commandHolder[cmd.name].guildID, {
        name: commandHolder[cmd.name].name,
        description: ((commandHolder[cmd.name].type === 1) ? commandHolder[cmd.name].description : undefined),
        options: ((commandHolder[cmd.name].type === 1) ? commandHolder[cmd.name].options : undefined),
        type: commandHolder[cmd.name].type
        
      }
    )
    else await client.createCommand({
      name: commandHolder[cmd.name].name,
      description: ((commandHolder[cmd.name].type === 1) ? commandHolder[cmd.name].description : undefined),
      options: ((commandHolder[cmd.name].type === 1) ? commandHolder[cmd.name].options : undefined),
      type: commandHolder[cmd.name].type
    })
    msg.info("Command Handler", "Added " + commandHolder[cmd.name].name+".")
  }
  msg.info("Command Handler", "Finished Loading Commands.")
}


client.on('interactionCreate', (interaction: any) => {
  //TODO: passing interaction through willy nilly is a bad idea, we should create a proper safety net.

  // const safetyNet = {
  //   acknowledged: interaction.acknowledged,
  //   guildID: interaction.guildID,

  //   respond: (content, file) => {
      
  //   }

  // }

  commandHolder[interaction.data.name].runCommand(interaction)

})


const msg = {
  debug: (id: string, msg: string) => {if (typeof config.debug !== "undefined" && config.debug === true) console.log("[\x1b[92m"+new Date().toLocaleString()+"\x1b[0m][\x1b[90mDBG\x1b[0m][\x1b[31m"+id+"\x1b[0m]\x1b[90m " + msg + "\x1b[0m")},
  info: (id: string, msg: string) => console.log("[\x1b[92m"+new Date().toLocaleString()+"\x1b[0m][\x1b[34mInfo\x1b[0m][\x1b[31m"+id+"\x1b[0m] " + msg),
  error: (id: string, msg: string) => console.error("[\x1b[92m"+new Date().toLocaleString()+"\x1b[0m][\x1b[91mError\x1b[0m][E \x1b[32m" + id + "\x1b[0m] - " + msg)
}

client.on('ready', async () => {
  msg.debug("a", "a")
   msg.info("Eris", "Ready as " + client.user.username + "#" + client.user.discriminator)
   loadCommands()
})

msg.info("System", "Starting, Please wait...")
loadEvents().then(client.connect)