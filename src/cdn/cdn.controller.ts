import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CdnService } from './cdn.service';

@Controller('cdn')
export class CdnController {
    constructor(private _service: CdnService) { }

    @Get(':file')
    public getFile(@Req() req: Request, @Res() res: Response): Promise<void> {
        return this._service.getFile(req, res);
    }

    @Post()
    public createFile(@Req() req: Request, @Res() res: Response): Promise<void> {

        //@ts-ignore
        return this._service.createFiles(req.file, res);
    }
}
