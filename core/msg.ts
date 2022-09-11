// const config = require('../config.json')


const msg = {
    debug: (id: string, msg: string) => {console.log("[\x1b[92m"+new Date().toLocaleString()+"\x1b[0m][\x1b[90mDBG\x1b[0m][\x1b[31m"+id+"\x1b[0m]\x1b[90m " + msg + "\x1b[0m")},
    info: (id: string, msg: string) => console.log("[\x1b[92m"+new Date().toLocaleString()+"\x1b[0m][\x1b[34mInfo\x1b[0m][\x1b[31m"+id+"\x1b[0m] " + msg),
    error: (id: string, msg: string) => console.error("[\x1b[92m"+new Date().toLocaleString()+"\x1b[0m][\x1b[91mError\x1b[0m][\x1b[32m" + id + "\x1b[0m] - " + msg)
  }
export {msg}
  