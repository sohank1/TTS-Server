import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { EventsGateway } from "./events.gateway";

@Module({
    imports: [AuthModule],
    // exports: [EventsGateway],
    providers: [EventsGateway],
})
export class EventsModule { }
