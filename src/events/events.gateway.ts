import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserResponseObject } from "src/user/types/UserResponseObject";
import { Events } from "./events";


@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection {

    @WebSocketServer()
    public server: Server;

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

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Client connected: ${client.id}`);
    }
}
