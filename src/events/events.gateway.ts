import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { UserResponseObject } from "src/user/types/UserResponseObject";
import { Events } from "./events";


@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection {

    @WebSocketServer()
    public server: Server;

    public constructor(private _auth: AuthService) { }

    public handleConnection(client: Socket, ...args: any[]) {
        console.log(`Client connected: ${client.id}`);
    }

    public emitNewUser(user: UserResponseObject): boolean {
        return this.server.emit(Events.NEW_USER, user);
    }

    public emitUserUpdate(user: UserResponseObject): boolean {
        return this.server.emit(Events.USER_UPDATE, user);
    }

    @SubscribeMessage("message")
    public handleMessage(client: Socket, message: string): void {
        client.emit("message", "got your message " + message)
        client.broadcast.emit("message", "a guy sent me a message")
    }

    @SubscribeMessage("auth")
    public async handleAuth(client: Socket, { accessToken }: { accessToken: string }): Promise<void> {
        let user: UserResponseObject;

        try {
            user = await this._auth.me(accessToken);
        }

        catch (err) {
            console.log(err)
        }
        console.log("emiting")
        client.emit("auth-success", { user });
    }

}
