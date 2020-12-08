import { Controller, Get, Param } from '@nestjs/common';
import { UserResponseObject } from './types/UserResponseObject';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private _service: UserService) { }

    @Get()
    public getAll(): Promise<UserResponseObject[]> {
        return this._service.getAll();
    }

    @Get(':id')
    public get(@Param('id') id: string): Promise<UserResponseObject> {
        return this._service.get(id);
    }
}
