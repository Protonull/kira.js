"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reconnecting_websocket_1 = __importDefault(require("reconnecting-websocket"));
const ws_1 = __importDefault(require("ws"));
const defaults = __importStar(require("./defaults"));
const utilities_1 = require("./utilities");
class KiraJS {
    constructor(options) {
        this.#requestCount = 0;
        this.#connection = new reconnecting_websocket_1.default((options?.kira?.protocol ?? defaults.KiraProtocol) + "://" +
            (options?.kira?.host ?? defaults.KiraHost) + ":" +
            (options?.kira?.port ?? defaults.KiraPort), [], {
            WebSocket: ws_1.default,
            minReconnectionDelay: 10_000,
            connectionTimeout: 1_000,
            maxRetries: Infinity,
            ...options.socket
        });
        this.#connection.onopen = this.onOpen;
        this.#connection.onclose = this.onClose;
        this.#connection.onerror = this.onError;
        this.#connection.onmessage = this.onData;
    }
    #connection;
    #requestCount;
    #requests;
    onData(raw) {
        const data = utilities_1.jsonSafeParse(raw.data, {});
        switch (data.type) {
            case "auth": {
                if (data["valid"] === true) {
                    this.onAuth(data);
                }
                else {
                    this.onNoAuth(data);
                }
                break;
            }
            case "new-token": {
                this.onNewToken(data);
                break;
            }
            case "ingame-response": {
                const packet = data;
                const callback = this.#requests[packet.identifier];
                if (typeof callback === "function") {
                    callback(packet.response);
                }
                else {
                    this.onUncaughtResponse(data);
                }
                break;
            }
            case "data": {
                const packet = data;
                if (Array.isArray(packet["group-messages"])) {
                    packet["group-messages"].forEach(message => this.onGroupMessage(message));
                }
                if (Array.isArray(packet["snitch-alerts"])) {
                    packet["snitch-alerts"].forEach(ping => this.onSnitchPing(ping));
                }
                if (Array.isArray(packet["skynet"])) {
                    packet["skynet"].forEach(ping => this.onSkynetPing(ping));
                }
                if (Array.isArray(packet["new-players"])) {
                    packet["new-players"].forEach(ping => this.onNewPlayerPing(ping));
                }
                break;
            }
            default: {
                this.onUnhandledPacket(data);
                break;
            }
        }
    }
    onOpen() {
    }
    onClose(event) {
    }
    onError(event) {
    }
    onUnhandledPacket(data) {
    }
    onAuth(packet) {
    }
    onNoAuth(packet) {
    }
    onNewToken(packet) {
    }
    onUncaughtResponse(packet) {
    }
    onGroupMessage(message) {
    }
    onSnitchPing(ping) {
    }
    onSkynetPing(ping) {
    }
    onNewPlayerPing(ping) {
    }
    requestNewToken() {
        this.sendRaw({
            type: "new-token"
        });
    }
    sendCommand(command, callback) {
        const requestId = "" + (++this.#requestCount);
        this.#requests[requestId] = callback;
        this.sendRaw({
            type: "in-game",
            identifier: requestId,
            command: command ?? ""
        });
    }
    sendRaw(data) {
        this.#connection.send(JSON.stringify(data));
    }
}
exports.default = KiraJS;
