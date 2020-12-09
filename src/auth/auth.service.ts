import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/user/user.schema";
import { Model } from "mongoose";
import { Profile } from "passport-discord";
import { getTag } from "src/user/util/get-tag.util";
import { EventsGateway } from "src/events/events.gateway";
import { getAvatarUrl } from "src/user/util/get-avatar-url.util";
import { Request, Response } from "express";
import { environment } from "src/environment/environment";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private Users: Model<User>,
        private events: EventsGateway,
        private _userService: UserService
    ) { }

    public async validateUser(accessToken: string, refreshToken: string, profile: Profile, done: (err: Error, user?: User) => void): Promise<User> {
        try {
            console.log(profile.guilds.find(g => g.id === "570349873337991203"));
            const user = await this.Users.findOne({ id: profile.id });
            if (user) {
                const url = getAvatarUrl(profile.id, profile.avatar);
                const tag = getTag(profile.username, profile.discriminator);

                if (user.avatarUrl === url && user.tag === tag) return user;

                user.avatarUrl = url.includes("null")
                    ? "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png"
                    : url;
                user.tag = tag;

                await user.save();
                this.events.emitUserUpdate(this._userService.toResponseObject(user));
                done(null, user);
                return user;

            } else {
                const url = getAvatarUrl(profile.id, profile.avatar);

                const newUser = new this.Users({
                    id: profile.id,
                    tag: getTag(profile.username, profile.discriminator),
                    avatarUrl: url.includes("null")
                        ? "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png"
                        : url,
                });

                await newUser.save();
                this.events.emitNewUser(this._userService.toResponseObject(newUser));
                done(null, newUser);
                return user;
            }
        } catch (err) {
            console.log(err);
            done(err, null);
            return null;
        }
    }

    public async redirect(req: Request, res: Response, url: string): Promise<void> {
        console.log(url, req.query)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (url) return res.redirect(url);
        return res.redirect(environment.CLIENT_DASHBOARD_URL);
    }

    public logout(req: Request, res: Response): void {
        if (!req.user) throw new HttpException("Cannot logout when not logged in.", HttpStatus.BAD_REQUEST);
        // this.events.emitUserLogout(<User>req.user);
        req.logOut();

        req.query.redirect ? res.redirect(<string>req.query.redirect)
            : res.redirect(environment.CLIENT_BASE_URL);
    }
}
