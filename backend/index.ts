import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { EurovisionDB, EurovisionSqliteDB } from './src/db';

const cors = require('cors');
const path = require('path');
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE']
}));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Eurovision Server running');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});


// V1

const db_files = new EurovisionDB();

app.get('/api/v1/:key', cors(), (req: Request, res: Response) => {
  db_files.getData(req.params.key, (data: any) => {
    res.send(data);
  }, (err: string) => {
    res.send(db_files.getDefault());
  });
});

app.post('/api/v1/:key', cors(), (req: Request, res: Response) => {
  db_files.setData(req.params.key, req.body, () => {
    res.send('Data saved successfully');
  });
});

app.delete('/api/v1/:key', cors(), (req: Request, res: Response) => {
  db_files.deleteData(req.params.key, () => {
    res.send('Data deleted successfully');
  });
});

// V2
app.get('/api/v2/users', cors(), (req: Request, res: Response) => {
  const db = EurovisionSqliteDB.getInstance();

  const users = db.getUsers();
  res.send(users);
});

app.get('/api/v2/scores', cors(), (req: Request, res: Response) => {
  const user = req.query.u; // TODO refactor
  if (typeof user !== 'string') {
    res.status(400).send('Invalid user: ' + user);
    return;
  }
  const db = EurovisionSqliteDB.getInstance();
  const scores = db.getScores(user);
  res.send(scores);
});

app.post("/api/v2/user", cors(), (req: Request, res: Response) => {
  const user = req.query.u;
  if (typeof user !== 'string') {
    res.status(400).send('Invalid user');
    return;
  }
  const db = EurovisionSqliteDB.getInstance();
  const result = db.addUser(user);
  if (!result) { // TODO refactor
    res.status(200).send();
  }
  else {
    res.status(400).send(result);
  }
});

app.put("/api/v2/scores", cors(), (req: Request, res: Response) => {
  const body = req.body;
  console.log('body', body);
  const user = req.query.u;
  if (typeof user !== 'string') {
    res.status(400).send('Invalid user');
    return;
  }
  const db = EurovisionSqliteDB.getInstance();
  const result = db.setScores(user, body);
  if (!result) {
    res.status(200).send();
  }
  else {
    res.status(400).send(result);
  }
});

app.delete("/api/v2/harakiri", cors(), (req: Request, res: Response) => {
  EurovisionSqliteDB.getInstance().resetDb();
  res.status(200).send();
});
