import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { LoginAuthGuard } from "./login-auth.guard";
import { AuthService } from "./auth.service";

let url: string;

@Controller()
export class AuthController {
    constructor(private service: AuthService) { }

    @Get("login")
    @UseGuards(LoginAuthGuard)
    public login(@Req() req: Request): void {
        console.log(req.query)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        url = req.query.redirect;
    }


    @Get("login/redirect")
    @UseGuards(LoginAuthGuard)
    public async redirect(@Req() req: Request, @Res() res: Response): Promise<void> {
        return this.service.redirect(req, res, url);
    }


    @Get("logout")
    public logout(@Req() req: Request, @Res() res: Response): void {
        return this.service.logout(req, res);
    }
}
