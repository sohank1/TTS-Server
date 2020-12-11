import { HttpException, HttpService, HttpStatus, Injectable } from "@nestjs/common";
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
import { Guild } from "src/guild/guild.schema";
import { getIconUrl } from "src/guild/util/get-icon.util";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private UserModel: Model<User>,
        @InjectModel(Guild.name)
        private GuildModel: Model<Guild>,
        private events: EventsGateway,
        private _userService: UserService,
        private _http: HttpService
    ) { }

    public async validateUser(accessToken: string, refreshToken: string, profile: Profile, done: (err: Error, user?: User) => void): Promise<User> {
        try {
            // await this.GuildModel.create({ iconUrl: '', members: [], name: '', roles: [] });
            const tts = await this.fetchUsers();
            await this.fetchGuild(tts);

            console.log((await this.GuildModel.findOne()).members[6].id);

            const user = await this.UserModel.findOne({ id: profile.id });
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

                const newUser = new this.UserModel({
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

    public async redirect(res: Response): Promise<Response> {
        res.redirect(environment.CLIENT_DASHBOARD_URL);
        return res.status(200).json({ message: "Successfully redirected." });
    }

    public logout(req: Request, res: Response): void {
        if (!req.user) throw new HttpException("Cannot logout when not logged in.", HttpStatus.BAD_REQUEST);
        // this.events.emitUserLogout(<User>req.user);
        req.logOut();

        req.query.redirect ? res.redirect(<string>req.query.redirect)
            : res.redirect(environment.CLIENT_BASE_URL);
    }

    public async fetchUsers(): Promise<Guild> {
        const tts = await this.GuildModel.findOne();

        this._http.get(`https://discord.com/api/v8/guilds/${environment.TTS_DISCORD_SERVER_ID}/members?limit=1000`, {
            headers: {
                'Authorization': `Bot ${process.env.BOT_TOKEN}`
            }
        })
            .subscribe(async (r) => {
                tts.members = [];
                for (const m of r.data)
                    if (!m.user.bot)
                        tts.members.push({
                            id: m.user.id,
                            username: m.user.username,
                            discriminator: m.user.discriminator,
                            bot: m.user.bot ? true : false,

                            roles: m.roles.map((id: string) => tts.roles.find(r => r.id === id)),
                            joinedAt: new Date(m.joined_at),
                        });

            });
        return tts;
    }

    public async fetchGuild(tts: Guild): Promise<void> {
        this._http.get(`https://discord.com/api/v8/guilds/${environment.TTS_DISCORD_SERVER_ID}`, {
            headers: {
                'Authorization': `Bot ${process.env.BOT_TOKEN}`
            }
        })

            .subscribe(async (r) => {
                tts.id = r.data.id;
                tts.name = r.data.name;
                tts.iconUrl = getIconUrl(tts.id, r.data.icon);
                tts.roles = r.data.roles;

                console.log(await tts.updateOne(tts));
                console.log(await tts.save());
            });
    }
}
