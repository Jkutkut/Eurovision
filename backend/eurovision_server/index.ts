import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import EurovisionDB from './src/db';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

const db = new EurovisionDB();

db.getData('test', (data: any) => {
  console.log(data);
});

db.setData(
  'othertest',
  {
    test: 'test'
  }
);