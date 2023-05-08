import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['localhost'] });

client.execute('select key from system.local', (err, result) => {
  if (err) throw err
  console.log(result.rows[0])
});

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
