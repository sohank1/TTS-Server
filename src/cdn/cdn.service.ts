import { HttpException, HttpService, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Client, MessageAttachment, TextChannel } from 'discord.js';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { resolve } from 'path';
import { File as FileDoc } from './file/file.schema';

@Injectable()
export class CdnService {
    private _client = new Client();

    constructor(
        @InjectModel(FileDoc.name)
        private FileModel: Model<FileDoc>,
        private _http: HttpService
    ) { }

    public async createFiles(files: File[], fileName: string): Promise<void> {
        console.log(files);
        this._client.login(process.env.BOT_TOKEN);

        this._client.on('ready', async () => {
            const channel = <TextChannel>this._client.channels.cache.get('795712339785154582');

            for (const f of files) {
                // If the file already exists throw an error.
                if (await this.FileModel.findOne({ path: `/${fileName}` }))
                    throw new HttpException('File already exists', HttpStatus.BAD_REQUEST)

                const a = new MessageAttachment(await f.text())
                const { attachments } = await channel.send(a);

                await this.FileModel.create({
                    path: `/${fileName}`,
                    url: attachments.first().url,
                });
            }
        });
    }

    public async getFile(req: Request, res: Response): Promise<void> {
        const path = req.url.split('/cdn')[1];

        const file = await this.FileModel.findOne({ path });
        if (!file) return res.sendFile(resolve("./client/dist/TTS-Client/index.html"))

        const r = await this._http.axiosRef({
            method: 'get',
            responseType: 'stream',
            url: file.url,
        });

        r.data.pipe(res);
    }
}
