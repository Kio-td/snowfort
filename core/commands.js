"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCommands = exports.commandHolder = void 0;
var index_1 = require("../index");
var path = require("path");
var fs = require("fs/promises");
var commandHolder = {};
exports.commandHolder = commandHolder;
var loadCommands = function (client, config) { return __awaiter(void 0, void 0, void 0, function () {
    var commandPath, commandFiles, _a, commandFiles_1, commandFiles_1_1, file, command, cmd, e_1_1;
    var _b, e_1, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                index_1.msg.info("Command Handler", "Loading Commands, please wait...");
                commandPath = path.join(__dirname, '..', 'commands');
                return [4 /*yield*/, fs.readdir(commandPath)];
            case 1:
                commandFiles = (_e.sent()).filter(function (file) { return file.endsWith(".js"); });
                _e.label = 2;
            case 2:
                _e.trys.push([2, 15, 16, 21]);
                _a = true, commandFiles_1 = __asyncValues(commandFiles);
                _e.label = 3;
            case 3: return [4 /*yield*/, commandFiles_1.next()];
            case 4:
                if (!(commandFiles_1_1 = _e.sent(), _b = commandFiles_1_1.done, !_b)) return [3 /*break*/, 14];
                _d = commandFiles_1_1.value;
                _a = false;
                file = _d;
                if (!(typeof config.__protected.disableSanitizer !== "undefined" || config.__protected.disableSanitizer === false)) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, index_1.sanitzeScripts)("command", path.join(commandPath, file))];
            case 5:
                if (!(_e.sent()))
                    return [2 /*return*/, false];
                _e.label = 6;
            case 6:
                command = require(path.join(commandPath, file));
                cmd = new command(client);
                if (typeof commandHolder[cmd.name] !== 'undefined') {
                    index_1.msg.error("Command Handler", file + " has the invoker " + cmd.name + ", which is already taken. Command is discarded!");
                    return [3 /*break*/, 13];
                }
                commandHolder[cmd.name] = cmd;
                if (commandHolder[cmd.name].type === 1) {
                    //Some additional checks need to be preformed here.
                }
                else {
                    if (commandHolder[cmd.name].description === undefined ||
                        commandHolder[cmd.name].options === undefined) {
                        index_1.msg.error("Command Handler", "Command " + cmd.name + " cannot be added; It's not a CHAT_INPUT type, but still has a description or options. Command is discarded!");
                        return [3 /*break*/, 13];
                    }
                }
                if (!(typeof commandHolder[cmd.name].onLoad === "function")) return [3 /*break*/, 8];
                return [4 /*yield*/, commandHolder[cmd.name].onLoad(client)];
            case 7:
                _e.sent();
                _e.label = 8;
            case 8:
                if (!(commandHolder[cmd.name].guildID !== undefined)) return [3 /*break*/, 10];
                return [4 /*yield*/, client.createGuildCommand(commandHolder[cmd.name].guildID, {
                        name: commandHolder[cmd.name].name,
                        description: ((commandHolder[cmd.name].type === 1) ? commandHolder[cmd.name].description : undefined),
                        options: ((commandHolder[cmd.name].type === 1) ? commandHolder[cmd.name].options : undefined),
                        type: commandHolder[cmd.name].type
                    })];
            case 9:
                _e.sent();
                return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, client.createCommand({
                    name: commandHolder[cmd.name].name,
                    description: ((commandHolder[cmd.name].type === 1) ? commandHolder[cmd.name].description : undefined),
                    options: ((commandHolder[cmd.name].type === 1) ? commandHolder[cmd.name].options : undefined),
                    type: commandHolder[cmd.name].type
                })];
            case 11:
                _e.sent();
                _e.label = 12;
            case 12:
                index_1.msg.debug("Command Handler", file + " added " + commandHolder[cmd.name].name + ".");
                _e.label = 13;
            case 13:
                _a = true;
                return [3 /*break*/, 3];
            case 14: return [3 /*break*/, 21];
            case 15:
                e_1_1 = _e.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 21];
            case 16:
                _e.trys.push([16, , 19, 20]);
                if (!(!_a && !_b && (_c = commandFiles_1.return))) return [3 /*break*/, 18];
                return [4 /*yield*/, _c.call(commandFiles_1)];
            case 17:
                _e.sent();
                _e.label = 18;
            case 18: return [3 /*break*/, 20];
            case 19:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 20: return [7 /*endfinally*/];
            case 21:
                index_1.msg.info("Command Handler", "Finished Loading Commands.");
                return [2 /*return*/];
        }
    });
}); };
exports.loadCommands = loadCommands;
