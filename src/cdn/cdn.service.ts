import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Client, MessageAttachment, TextChannel } from 'discord.js';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { resolve } from 'path';
import { File as FileDoc } from './file/file.schema';

const client = new Client();
client.login(process.env.BOT_TOKEN);

@Injectable()
export class CdnService {
    constructor(
        @InjectModel(FileDoc.name)
        private FileModel: Model<FileDoc>,
        private _http: HttpService
    ) { }

    public async createFiles(filesSent: any, res: Response): Promise<void> {

        let files = [];
        for (const k in filesSent) files.push(filesSent[k]);

        files = files.map(f => {
            const secondToLast = f.name.split(".")[f.name.split(".").length - 2]
            const random = `-${Math.random().toString(36).substr(2, 7)}`;

            f.name = insert(f.name, secondToLast.length, random);

            return f;
        })

        console.log(files)

        const channel = <TextChannel>client.channels.cache.get('795712339785154582');
        console.log("sending")
        for (const f of files) {
            // If the file already exists throw an error.
            if (await this.FileModel.findOne({ path: `/${f.name}` }))
                throw new HttpException('File already exists', HttpStatus.BAD_REQUEST)

            const a = new MessageAttachment(f.data)
            const { attachments } = await channel.send(a);

            await this.FileModel.create({
                path: `/${f.name}`,
                url: attachments.first().url,
            });

            res.send({ message: "Created file." })
        }
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

    public async getAll(): Promise<FileDoc[]> {
        return this.FileModel.find();
    }
}



function insert(str: string, index: number, value: string): string {
    return str.substr(0, index) + value + str.substr(index);
}