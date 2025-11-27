'use strict';

const fs = require('fs');

class StorageService {
    constructor(folder) {
        this._folder = folder;

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
    }

    writeFile(file, meta) {
        const fileName = `${Date.now()}-${meta.filename}`;
        const filePath = `${this._folder}/${fileName}`;

        const filestream = fs.createWriteStream(filePath);

        return new Promise((resolve, reject) => {
            filestream.on('error', (error) => {
                reject(error);
            });

            file.pipe(filestream);
            file.on('end', () => {
                resolve(fileName);
            });
        });
    }
}

module.exports = StorageService;
