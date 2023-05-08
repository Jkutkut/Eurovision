const fs = require('fs');

class EurovisionDB {
    dir: string;

    constructor(dir: string = './db') {
        this.dir = dir;
    }

    private filename(key: string) {
        return `${this.dir}/${key}.json`;
    }

    public getData(
        key: string,
        callback: (data: any) => void,
        error: (err: string) => void = (err: string) => console.error(err)
    ) {
        fs.readFile(this.filename(key), (err: any, data: any) => {
            if (err) {
                error(err);
                return;
            }
            callback(JSON.parse(data));
        });
    }

    public setData(key: string, value: any) {
        const data = JSON.stringify(value);
        fs.writeFile(this.filename(key), data, (err: any) => {
            if (err) throw err;
            console.log('File created successfully.');
        });
    }

    public deleteData(key: string) {
        fs.unlink(this.filename(key), (err: any) => {
            if (err) throw err;
            console.log('File deleted successfully.');
        });
    }
}

export default EurovisionDB;