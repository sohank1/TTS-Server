import { Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserResponseObject } from './types/UserResponseObject';
import { User } from './user.schema';
import { UserService } from './user.service';

@Controller()
export class UserController {
    constructor(private _service: UserService) { }

    @Get('users')
    public getAll(): Promise<UserResponseObject[]> {
        return this._service.getAll();
    }

    @Get('user:id')
    public get(@Param('id') id: string): Promise<UserResponseObject> {
        return this._service.get(id);
    }

    @Get('me')
    public getMe(@Req() req: Request): Promise<UserResponseObject> {
        return this._service.getMe(<User>req.user);
    }
}
