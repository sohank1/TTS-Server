/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { LoginAuthGuard } from "./login-auth.guard";
import { AuthService } from "./auth.service";


@Controller('api')
export class AuthController {
    constructor(private service: AuthService) { }

    @Get("login")
    @UseGuards(LoginAuthGuard)
    public async login(): Promise<void> {
        // return this.service.login(res);
    }


    @Get("login/redirect")
    @UseGuards(LoginAuthGuard)
    public async redirect(@Req() req: Request, @Res() res: Response): Promise<void> {
        return this.service.redirect(req, res);
    }

    // @Get("auth")
    // // @UseGuards(LoginAuthGuard)
    // public async getHash(@Req() req: Request, @Res() res: Response): Promise<void> {
    //     return this.service.getHash(req, res);
    // }

    @Get("logout")
    public logout(@Req() req: Request, @Res() res: Response): void {
        return this.service.logout(req, res);
    }
}
