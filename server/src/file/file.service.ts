import { HttpException, Injectable } from '@nestjs/common';
import { existsSync, opendirSync, readdir } from 'fs';

@Injectable()
export class FileService {

    async getFiles(): Promise<String[]> {
        const filePath = 'test_pdfs/';
        if (!existsSync(filePath)) {
            throw new HttpException("Folder not found.", 404);
        }
        var arrToReturn = [];
        const directory = opendirSync(filePath)
        let file;
        let index = 0;
        while ((file = directory.readSync()) !== null) {
            if (!file.name.includes(".pdf")) {
                continue;
            }
            //console.log(file.name)
            arrToReturn[index] = file.name;
            index++;
        }
        directory.closeSync();

        return arrToReturn;
    }

}