const fs = require('fs');

class EurovisionDB {
    dir: string;
    publicDir: string;
    eurovisionData: any;

    constructor(dir: string = './db', publicDir: string = './public') {
        this.dir = dir;
        this.publicDir = publicDir;
        this.eurovisionData;
        this.readFile(`${this.publicDir}/eurovision.json`, (data: any) => {
            this.eurovisionData = data;
            console.log('Eurovision data loaded successfully');
        }, (err: string) => console.error(err));
    }

    private filename(key: string) {
        return `${this.dir}/${key}.json`;
    }

    private readFile(
        filename: string,
        callback: (data: any) => void,
        error: (err: string) => void
    ) {
        fs.readFile(filename, (err: any, data: any) => {
            if (err) {
                error(err);
                return;
            }
            callback(JSON.parse(data));
        });
    }

    public getDefault() {
        console.log(this.eurovisionData);
        let defaultData = [];
        for (let i = 0; i < this.eurovisionData.countries.length; i++) {
            defaultData.push({
                song: this.eurovisionData.countries[i],
                points: -1,
                nickname: "",
                notes: ""
            });
        }
        return defaultData;
    }

    public getData(
        key: string,
        callback: (data: any) => void,
        error: (err: string) => void = (err: string) => console.error(err)
    ) {
        this.readFile(this.filename(key), callback, error);
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