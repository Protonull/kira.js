import { Options as WebsocketOptions } from "reconnecting-websocket";
export declare type KiraConnectionOptions = {
    protocol?: string;
    host?: string;
    port?: string | number;
};
export declare type KiraJSOptions = {
    name: string;
    token: string;
    kira?: KiraConnectionOptions;
    socket?: WebsocketOptions;
};
declare type Packet = {
    type: string;
};
declare type DataNugget = {
    time: number;
};
export declare type AuthPacket = Packet & {
    type: "auth";
    valid: true;
    expires: number;
    chats: string[];
    snitches: string[];
    skynet: boolean;
};
export declare type NonAuthPacket = Packet & {
    type: "auth";
    valid: false;
};
export declare type NewTokenPacket = Packet & {
    type: "new-token";
    secret: string;
    expires: number;
};
export declare type CommandResponsePacket = Packet & {
    type: "ingame-response";
    identifier: string;
    response: string;
};
export declare type DataPacket = Packet & {
    type: "data";
    "group-messages"?: GroupMessageNugget[];
    "snitch-alerts"?: SnitchPingNugget[];
    "skynet"?: SkynetPingNugget[];
    "new-players"?: NewPlayerPingNugget[];
};
export declare type GroupMessageNugget = DataNugget & {
    group: string;
    player: string;
    message: string;
};
export declare type SnitchPingNugget = DataNugget & {
    player: string;
    action: "ENTER" | "LOGIN" | "LOGOUT";
    snitch: {
        name: string;
        group: string;
        type: "LOGGING" | "ENTRY";
        location: {
            world: string;
            x: number;
            y: number;
            z: number;
        };
    };
};
export declare type SkynetPingNugget = DataNugget & {
    player: string;
    action: "LOGIN" | "LOGOUT";
};
export declare type NewPlayerPingNugget = DataNugget & {
    player: string;
};
export declare type RequestNewTokenPacket = Packet & {
    type: "new-token";
};
export declare type SendCommandPacket = Packet & {
    type: "in-game";
    identifier: string;
    command: string;
};
export {};
//# sourceMappingURL=types.d.ts.map