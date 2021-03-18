import {Options as WebsocketOptions} from "reconnecting-websocket";

export type KiraConnectionOptions = {
    protocol?: string,
    host?: string,
    port?: string | number
};

export type KiraJSOptions = {
    name: string,
    token: string,
    kira?: KiraConnectionOptions,
    socket?: WebsocketOptions,
};

// ------------------------------------------------------------
// Client-bound Packets
// ------------------------------------------------------------

type Packet = {
    type: string
};

type DataNugget = {
    time: number
};

export type AuthPacket = Packet & {
    type: "auth",
    valid: true,
    expires: number,
    chats: string[],
    snitches: string[],
    skynet: boolean
};

export type NonAuthPacket = Packet & {
    type: "auth",
    valid: false
};

export type NewTokenPacket = Packet & {
    type: "new-token",
    secret: string,
    expires: number
};

export type CommandResponsePacket = Packet & {
    type: "ingame-response",
    identifier: string,
    response: string
};

export type DataPacket = Packet & {
    type: "data",
    "group-messages"?: GroupMessageNugget[],
    "snitch-alerts"?: SnitchPingNugget[],
    "skynet"?: SkynetPingNugget[],
    "new-players"?: NewPlayerPingNugget[]
};

export type GroupMessageNugget = DataNugget & {
    group: string,
    player: string,
    message: string
};

export type SnitchPingNugget = DataNugget & {
    player: string,
    action: "ENTER" | "LOGIN" | "LOGOUT",
    snitch: {
        name: string,
        group: string,
        type: "LOGGING" | "ENTRY",
        location: {
            world: string,
            x: number,
            y: number,
            z: number
        }
    }
};

export type SkynetPingNugget = DataNugget & {
    player: string,
    action: "LOGIN" | "LOGOUT"
};

export type NewPlayerPingNugget = DataNugget & {
    player: string
};

// ------------------------------------------------------------
// Server-bound Packets
// ------------------------------------------------------------

export type RequestNewTokenPacket = Packet & {
    type: "new-token"
};

export type SendCommandPacket = Packet & {
    type: "in-game",
    identifier: string,
    command: string
};
