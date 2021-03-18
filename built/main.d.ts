import { CloseEvent, ErrorEvent } from "reconnecting-websocket";
import { AuthPacket, CommandResponsePacket, GroupMessageNugget, KiraJSOptions, NewPlayerPingNugget, NewTokenPacket, NonAuthPacket, SkynetPingNugget, SnitchPingNugget } from "./types";
export default class KiraJS {
    #private;
    constructor(options: KiraJSOptions);
    private onData;
    protected onOpen(): void;
    protected onClose(event: CloseEvent): void;
    protected onError(event: ErrorEvent): void;
    protected onUnhandledPacket(data: any): void;
    protected onAuth(packet: AuthPacket): void;
    protected onNoAuth(packet: NonAuthPacket): void;
    protected onNewToken(packet: NewTokenPacket): void;
    protected onUncaughtResponse(packet: CommandResponsePacket): void;
    protected onGroupMessage(message: GroupMessageNugget): void;
    protected onSnitchPing(ping: SnitchPingNugget): void;
    protected onSkynetPing(ping: SkynetPingNugget): void;
    protected onNewPlayerPing(ping: NewPlayerPingNugget): void;
    requestNewToken(): void;
    sendCommand(command: string, callback?: (string: any) => void): void;
    sendRaw(data: object | Array<any>): void;
}
//# sourceMappingURL=main.d.ts.map