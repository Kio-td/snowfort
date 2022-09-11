import { msg, sanitzeScripts } from '../index'
import path = require('path')
import fs = require('fs/promises') 
import Eris = require("eris")

let commandHolder : any = {}
const loadCommands = async (client: Eris.Client, config: any) => {
  msg.info("Command Handler", "Loading Commands, please wait...")
  const commandPath = path.join(__dirname, '..', 'commands')
  const commandFiles =  (await fs.readdir(commandPath)).filter(function (file: string) { return file.endsWith(".js") })
  for await (const file of commandFiles) {

    //This is where we sanitize our scripts.
     if (typeof config.__protected.disableSanitizer !== "undefined" || config.__protected.disableSanitizer === false)
      if (!await sanitzeScripts("command", path.join(commandPath, file))) return false

    const command = require(path.join(commandPath,file))
    const cmd = new command(client)
    if (typeof commandHolder[cmd.name] !== 'undefined') {
      msg.error("Command Handler", file + " has the invoker " + cmd.name + ", which is already taken. Command is discarded!")
      continue
    }
    commandHolder[cmd.name] = cmd
    if (commandHolder[cmd.name].type === 1) {
      //Some additional checks need to be preformed here.
    } else {
      if (commandHolder[cmd.name].description === undefined ||
        commandHolder[cmd.name].options === undefined) {
          msg.error("Command Handler", "Command " + cmd.name + " cannot be added; It's not a CHAT_INPUT type, but still has a description or options. Command is discarded!")
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
    msg.debug("Command Handler", file + " added " + commandHolder[cmd.name].name+".")
  }
  msg.info("Command Handler", "Finished Loading Commands.")
}

export {commandHolder, loadCommands}