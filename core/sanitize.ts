import fs = require('fs/promises')
import { msg } from './msg'


const sanitzeScripts = async (type: "event" | "command", location: string): Promise<boolean> => {

    const file = await fs.readFile(location, ('utf-8'))
  
    if (file.toLowerCase().includes("console.log") || file.toLowerCase().includes("console.error") || file.toLowerCase().includes("console.warn")) {
      msg.error("Sanity", "console.{debug, log, warn, error} was found; changing to msg.warn to keep our logs looking neat!")
      file.replaceAll(/console.log/ig, "msg.info")
      file.replaceAll(/console.warn/ig, "msg.warn")
      file.replaceAll(/console.error/ig, "msg.error")
      await fs.writeFile(location, file)
    }
  
    //if all the conditions are met, we'll give it a thumbs up.
    return true
  }

  export default sanitzeScripts