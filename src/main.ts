import websocket, {CloseEvent, ErrorEvent} from "reconnecting-websocket";
import WS from "ws";
import {
    AuthPacket,
    CommandResponsePacket,
    DataPacket,
    GroupMessageNugget,
    KiraJSOptions,
    NewPlayerPingNugget,
    NewTokenPacket,
    NonAuthPacket,
    RequestNewTokenPacket,
    SendCommandPacket,
    SkynetPingNugget,
    SnitchPingNugget
} from "./types";
import * as defaults from "./defaults";
import {jsonSafeParse} from "./utilities";

export default class KiraJS {

    #connection: websocket;

    #requestCount: number = 0;
    #requests: {[key: string]: (string) => void}

    constructor(options: KiraJSOptions) {
        this.#connection = new websocket(
            (options?.kira?.protocol ?? defaults.KiraProtocol) + "://" +
            (options?.kira?.host ?? defaults.KiraHost) + ":" +
            (options?.kira?.port ?? defaults.KiraPort) + "/" +
            "?apiToken=" + (options?.token) +
            "&applicationId=" + (options?.name) +
            "&apiVersion=1",
            [],
            {
                WebSocket: WS,
                minReconnectionDelay: 10_000, // 10 seconds
                connectionTimeout: 1_000,
                maxRetries: Infinity,
                ...options.socket
            }
        );
        this.#connection.onopen = this.onOpen;
        this.#connection.onclose = this.onClose;
        this.#connection.onerror = this.onError;
        this.#connection.onmessage = this.onData;
    }

    private onData(raw: MessageEvent) {
        const data = jsonSafeParse(raw.data, {});
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
                const packet: CommandResponsePacket = data;
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
                const packet: DataPacket = data;
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

    protected onOpen() {

    }

    protected onClose(event: CloseEvent) {

    }

    protected onError(event: ErrorEvent) {

    }

    protected onUnhandledPacket(data: any) {

    }

    protected onAuth(packet: AuthPacket) {

    }

    protected onNoAuth(packet: NonAuthPacket) {

    }

    protected onNewToken(packet: NewTokenPacket) {

    }

    protected onUncaughtResponse(packet: CommandResponsePacket) {

    }

    protected onGroupMessage(message: GroupMessageNugget) {

    }

    protected onSnitchPing(ping: SnitchPingNugget) {

    }

    protected onSkynetPing(ping: SkynetPingNugget) {

    }

    protected onNewPlayerPing(ping: NewPlayerPingNugget) {

    }

    requestNewToken() {
        this.sendRaw(<RequestNewTokenPacket>{
            type: "new-token"
        });
    }

    sendCommand(command: string, callback?: (string) => void) {
        const requestId = "" + (++this.#requestCount);
        this.#requests[requestId] = callback;
        this.sendRaw(<SendCommandPacket>{
            type: "in-game",
            identifier: requestId,
            command: command ?? ""
        });
    }

    sendRaw(data: object | Array<any>) {
        this.#connection.send(JSON.stringify(data));
    }

}
