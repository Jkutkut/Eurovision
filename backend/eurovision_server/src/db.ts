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

    public setData(
        key: string,
        value: any,
        callback: () => void = () => console.log('Data saved successfully'),
        error: (err: string) => void = (err: string) => console.error(err)
    ) {
        const data = JSON.stringify(value);
        fs.writeFile(this.filename(key), data, (err: any) => {
            if (err)
                error(err);
            else
                callback();
        });
    }

    public deleteData(
        key: string,
        callback: () => void = () => console.log('Data deleted successfully'),
        error: (err: string) => void = (err: string) => console.error(err)
    ) {
        fs.unlink(this.filename(key), (err: any) => {
            if (err)
                error(err);
            else
                callback();
        });
    }
}

export default EurovisionDB;