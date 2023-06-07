"use strict";
// const config = require('../config.json')
Object.defineProperty(exports, "__esModule", { value: true });
exports.msg = void 0;
var msg = {
    debug: function (id, msg) { if (process.env.DEBUG)
        console.log("[\x1b[92m" + new Date().toLocaleString() + "\x1b[0m][\x1b[90mDBG\x1b[0m][\x1b[31m" + id + "\x1b[0m]\x1b[90m " + msg + "\x1b[0m"); },
    info: function (id, msg) { return console.log("[\x1b[92m" + new Date().toLocaleString() + "\x1b[0m][\x1b[34mInfo\x1b[0m][\x1b[31m" + id + "\x1b[0m] " + msg); },
    error: function (id, msg) { return console.error("[\x1b[92m" + new Date().toLocaleString() + "\x1b[0m][\x1b[91mError\x1b[0m][\x1b[32m" + id + "\x1b[0m] - " + msg); }
};
exports.msg = msg;
