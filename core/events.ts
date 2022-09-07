const config = require('./config.json')
import { msg } from './msg'
import Eris = require('eris')
import fs = require('fs/promises')
import path = require('path')

// Our main Event Holder. Not to be persistant - just to retrieve information about the modules.
let eventHolder : any = {}

// I've created a new event constructor that'll allow us to know what we're running. ouo
const loadEvents = async (client: Eris.Client) => {
  if (typeof config.disableSanitizer !== "undefined" && config.disableSanitizer === true)
    msg.error("System", "\n" + "=+".repeat(21) + "\n\x1b[5m\x1b[4m\x1b[31mHEY!\x1b[0m\nYou've disabled the script sanitizer, which re-enables certain parts of JS that bad actors use!\n"+
    "If some 3rd party requests you turn it off to use their script, they're not very good at coding, or they're trying to infect you with a virus.\n" +
    "Any coder worth their grain in salt can comply with the simpler APIs that we provide, that protect you!\n" +
    "We really suggest turning it off if you don't like big warnings!\n" + "=+".repeat(21) + "\n(Sleeping for 7 seconds)")
    await new Promise(resolve => setTimeout(resolve, 7000));
  msg.info("Event Handler", "Loading Events, please wait...")
  const eventsPath = path.join(__dirname, 'events')
  const eventFiles = (await fs.readdir(eventsPath)).filter(function (file: string) { return file.endsWith(".js") })
  for await (const file of eventFiles) {
    const event = require(path.join(eventsPath, file))
    eventHolder[file] = new event(client)
    await eventHolder[file].onLoad()
    client.on(eventHolder[file].listener, eventHolder[file].runEvent)
    msg.info("Event Handler", "Added " + eventHolder[file].name + ".")
  }
  msg.info("Event Handler", "Finished Loading Events.")
}

export {eventHolder, loadEvents}