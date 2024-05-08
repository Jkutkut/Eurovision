const fs = require('fs');

class EurovisionDB {
    dir: string;
    publicDir: string;
    eurovisionData: any;

    constructor(dir: string = './db', publicDir: string = './public') {
        this.dir = dir;
        this.publicDir = publicDir;
        this.eurovisionData;
        this.readFile(`${this.publicDir}/eurovision2024.json`, (data: any) => {
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

import Database from 'better-sqlite3';

class EurovisionSqliteDB {
  private static DB_PATH = './db/eurovision.db';
  private static JSON_PATH = './public/eurovision2024.json';

  private static instance: EurovisionSqliteDB;
  private db;
  private _eurovisionData: any;

  private constructor() {
    this.db = new Database(EurovisionSqliteDB.DB_PATH, { verbose: console.log });
    this.initDb();
    this.readFile(EurovisionSqliteDB.JSON_PATH, (data: any) => {
      this.eurovisionData = data;
      console.log('Eurovision data loaded successfully');
    }, (err: string) => console.error(err));
  }

  public static getInstance(): EurovisionSqliteDB {
    if (!EurovisionSqliteDB.instance) {
      EurovisionSqliteDB.instance = new EurovisionSqliteDB();
    }
    return EurovisionSqliteDB.instance;
  }

  private treatSql(sql: string) {
    return sql.split('\n')
      .map(line => line.trim())
      .join(' ');
  }

  private initDb() {
    this.db.pragma('journal_mode = WAL');
    this.db.prepare(this.treatSql(
      `CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )`
    )).run();
    this.db.prepare(this.treatSql(
      `CREATE TABLE IF NOT EXISTS score (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        song INTEGER NOT NULL,

        points INTEGER NOT NULL,
        nickname TEXT,
        notes TEXT,

        FOREIGN KEY (user_id) REFERENCES user(id)
      )`
    )).run();
    process.on('exit', () => {
      console.log('Closing database');
      this.db.close();
    });
    process.on('SIGHUP', () => process.exit(128 + 1));
    process.on('SIGINT', () => process.exit(128 + 2));
    process.on('SIGTERM', () => process.exit(128 + 15));
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

  public get eurovisionData() {
    return this._eurovisionData;
  }

  private set eurovisionData(data: any) {
    this._eurovisionData = data;
  }

  // API
  public getUsers() {
    const stmt = this.db.prepare('SELECT * FROM user');
    return stmt.all();
  }

  public getScores(user: string) {
    const stmt = this.db.prepare(this.treatSql(
      'SELECT * FROM score WHERE user_id = ( SELECT id FROM user WHERE name = ? )'
    ));
    return stmt.all(user);
  }

  public addUser(name: string) {
    const stmt = this.db.prepare('INSERT INTO user (name) VALUES (?)');
    try {
      stmt.run(name);
    }
    catch (err) {
      return err;
    }
    return null;
  }

  public setScores(user: string, scores: EurovisionScore[]) {
    // const stmt = this.db.prepare(this.treatSql(
    //   `INSERT INTO score (user_id, song, points, nickname, notes)
    //    VALUES (@user_id, @song, @points, @nickname, @notes)`
    // ));

    // const scoresToInsert = scores.map((score, idx) => ({
    //   uId: idx,

    // })

    console.error('Not implemented');
  }

}

interface EurovisionScore {
  nickname: string;
  notes: string;
  points: number;
};

export { EurovisionDB, EurovisionSqliteDB };
