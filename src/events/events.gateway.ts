import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { UserResponseObject } from "src/user/types/UserResponseObject";
import { Events } from "./events";


@WebSocketGateway()
export class EventsGateway {

    @WebSocketServer()
    public io: Server;


    public emitNewUser(user: UserResponseObject): boolean {
        return this.io.emit(Events.NEW_USER, user);
    }

    public emitUserUpdate(user: UserResponseObject): boolean {
        return this.io.emit(Events.USER_UPDATE, user);
    }
}
