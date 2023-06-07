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
exports.loadEvents = exports.eventHolder = void 0;
var index_1 = require("../index");
var fs = require("fs/promises");
var path = require("path");
// Our main Event Holder. Not to be persistant - just to retrieve information about the modules.
var eventHolder = {};
exports.eventHolder = eventHolder;
// I've created a new event constructor that'll allow us to know what we're running. ouo
var loadEvents = function (client, config) { return __awaiter(void 0, void 0, void 0, function () {
    var eventsPath, eventFiles, _a, eventFiles_1, eventFiles_1_1, file, event_1, e_1_1;
    var _b, e_1, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (typeof config.disableSanitizer !== "undefined" && config.disableSanitizer === true)
                    index_1.msg.error("System", "\n" + "=+".repeat(21) + "\n\x1b[5m\x1b[4m\x1b[31mHEY!\x1b[0m\nYou've disabled the script sanitizer, which re-enables certain parts of JS that bad actors use!\n" +
                        "If some 3rd party requests you turn it off to use their script, they're not very good at coding, or they're trying to infect you with a virus.\n" +
                        "Any coder worth their grain in salt can comply with the simpler APIs that we provide, that protect you!\n" +
                        "We really suggest turning it off if you don't like big warnings!\n" + "=+".repeat(21) + "\n(Sleeping for 7 seconds)");
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 7000); })];
            case 1:
                _e.sent();
                index_1.msg.info("Event Handler", "Loading Events, please wait...");
                eventsPath = path.join(__dirname, '..', 'events');
                return [4 /*yield*/, fs.readdir(eventsPath)];
            case 2:
                eventFiles = (_e.sent()).filter(function (file) { return file.endsWith(".js"); });
                _e.label = 3;
            case 3:
                _e.trys.push([3, 9, 10, 15]);
                _a = true, eventFiles_1 = __asyncValues(eventFiles);
                _e.label = 4;
            case 4: return [4 /*yield*/, eventFiles_1.next()];
            case 5:
                if (!(eventFiles_1_1 = _e.sent(), _b = eventFiles_1_1.done, !_b)) return [3 /*break*/, 8];
                _d = eventFiles_1_1.value;
                _a = false;
                file = _d;
                event_1 = require(path.join(eventsPath, file));
                eventHolder[file] = new event_1(client);
                return [4 /*yield*/, eventHolder[file].onLoad()];
            case 6:
                _e.sent();
                client.on(eventHolder[file].listener, eventHolder[file].runEvent);
                index_1.msg.info("Event Handler", "Added " + eventHolder[file].name + ".");
                _e.label = 7;
            case 7:
                _a = true;
                return [3 /*break*/, 4];
            case 8: return [3 /*break*/, 15];
            case 9:
                e_1_1 = _e.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 15];
            case 10:
                _e.trys.push([10, , 13, 14]);
                if (!(!_a && !_b && (_c = eventFiles_1.return))) return [3 /*break*/, 12];
                return [4 /*yield*/, _c.call(eventFiles_1)];
            case 11:
                _e.sent();
                _e.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 14: return [7 /*endfinally*/];
            case 15:
                index_1.msg.info("Event Handler", "Finished Loading Events.");
                return [2 /*return*/];
        }
    });
}); };
exports.loadEvents = loadEvents;
