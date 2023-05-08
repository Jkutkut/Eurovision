import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import EurovisionDB from './src/db';

const path = require('path');
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
  res.send('Eurovision Server running');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

const db = new EurovisionDB();

app.get('/api/:key', (req: Request, res: Response) => {
  db.getData(req.params.key, (data: any) => {
    res.send(data);
  }, (err: string) => {
    res.send(err);
  });
});

app.post('/api/:key', (req: Request, res: Response) => {
  db.setData(req.params.key, req.body, () => {
    res.send('Data saved successfully');
  });
});

app.delete('/api/:key', (req: Request, res: Response) => {
  db.deleteData(req.params.key, () => {
    res.send('Data deleted successfully');
  });
});