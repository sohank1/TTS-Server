import { HttpStatus } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { UserResponseObject } from "src/user/types/UserResponseObject";
import { UserService } from "src/user/user.service";
import { Events } from "./events";


@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection {

    @WebSocketServer()
    public server: Server;

    public constructor(private _auth: AuthService, private _userService: UserService) { }

    public handleConnection(socket: Socket) {
        console.log(`Client connected: ${socket.id}`);

        socket.on("auth", async ({ accessToken }: { accessToken: string }) => {
            let user: UserResponseObject;

            try {
                user = await this._auth.me(accessToken);
            }

            catch (err) {
                return socket.emit("auth-error", {
                    error: {
                        message: "Invalid token",
                        code: HttpStatus.BAD_REQUEST
                    }
                })
            }

            socket.emit("auth-success", user);

            socket.on("get-user", async (id: string) => {
                const user = await this._userService.get(id);
                if (!user) return socket.emit("got-user", {
                    error: {
                        message: "User not found",
                        code: HttpStatus.NOT_FOUND
                    }
                })

                socket.emit("got-user", user)
            })
        })
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

}
