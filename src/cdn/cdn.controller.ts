import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CdnService } from './cdn.service';
import * as fs from 'fs';


@Controller('cdn')
export class CdnController {
    constructor(private _service: CdnService) { }

    @Get(':file')
    public async getFile(@Req() req: Request, @Res() res: Response): Promise<void> {
        return this._service.getFile(req, res);
    }


}
