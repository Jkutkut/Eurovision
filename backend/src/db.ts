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

    const data = fs.readFileSync(
      EurovisionSqliteDB.JSON_PATH,
      { encoding: 'utf8', flag: 'r' }
    );
    this.eurovisionData = JSON.parse(data);
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
        user_id INTEGER NOT NULL,
        song_id INTEGER NOT NULL,

        points INTEGER NOT NULL,
        nickname TEXT,
        notes TEXT,

        PRIMARY KEY (user_id, song_id),
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
      'SELECT * FROM score WHERE user_id = ( SELECT id FROM user WHERE name = ? ) ORDER BY points DESC'
    ));
    return stmt.all(user);
  }

  public addUser(name: string) {
    const stmt = this.db.prepare('INSERT OR IGNORE INTO user (name) VALUES (?)');
    try {
      stmt.run(name);
    }
    catch (err) {
      return err;
    }
    return null;
  }

  public setScores(user: string, scores: EurovisionScore[]) {
    const stmt = this.db.prepare(this.treatSql(`
      INSERT OR REPLACE INTO score (song_id, points, nickname, notes, user_id)
      VALUES (
        @song_id, @points, @nickname, @notes, @user_id
      )`
    ));
    const result = this.db.prepare('SELECT id FROM user WHERE name = ?').get(user) as any;
    if (!result) {
      return 'User not found';
    }
    const { id: userId } = result;
    const scoresToInsert = scores.map((score) => ({
      user_id: userId,
      ...score
    }));
    this.db.transaction(() => {
      for (const score of scoresToInsert) {
        console.log(score);
        stmt.run(score);
      }
    })();
  }

  public resetDb() {
    this.db.exec('DROP TABLE IF EXISTS score');
    this.db.exec('DROP TABLE IF EXISTS user');
    this.initDb();
  }

}

interface EurovisionScore {
  song_id: number;
  nickname: string;
  notes: string;
  points: number;
};

export { EurovisionDB, EurovisionSqliteDB };
