#!/bin/sh

# https://blog.logrocket.com/how-to-set-up-node-typescript-express/

BACK_NAME="eurovision_server"

mkdir -p $BACK_NAME
cd $BACK_NAME
npm init --yes

npm install express dotenv

# .env
echo "PORT=9000" > .env

# ------------- Javascript ------------- #

echo "const express = require('express');" > index.js
echo "const dotenv = require('dotenv');" >> index.js
echo "" >> index.js
echo "dotenv.config();" >> index.js
echo "" >> index.js
echo "const app = express();" >> index.js
echo "const port = process.env.PORT;" >> index.js
echo "" >> index.js
echo "app.get('/', (req, res) => {" >> index.js
echo "  res.send('Express + TypeScript Server');" >> index.js
echo "});" >> index.js
echo "" >> index.js
echo "app.listen(port, () => {" >> index.js
echo "  console.log(\`[server]: Server is running at http://localhost:\${port}\`);" >> index.js
echo "});" >> index.js

# node index.js # normal config

# ------------- Typescript ------------- #
# npm i -D typescript @types/express @types/node
# npx tsc --init # Create tsconfig.json
# Change de outDir in the compilerOptions to "outDir": "./dist",
# rm index.js

# echo "import express, { Express, Request, Response } from 'express';" > index.ts
# echo "import dotenv from 'dotenv';" >> index.ts
# echo "" >> index.ts
# echo "dotenv.config();" >> index.ts
# echo "" >> index.ts
# echo "const app: Express = express();" >> index.ts
# echo "const port = process.env.PORT;" >> index.ts
# echo "" >> index.ts
# echo "app.get('/', (req: Request, res: Response) => {" >> index.ts
# echo "  res.send('Express + TypeScript Server');" >> index.ts
# echo "});" >> index.ts
# echo "" >> index.ts
# echo "app.listen(port, () => {" >> index.ts
# echo "  console.log(\`⚡️[server]: Server is running at http://localhost:\${port}\`);" >> index.ts
# echo "});" >> index.ts
# npm install -D concurrently nodemon
# edit the scripts in package.json
#     "build": "npx tsc",
#     "start": "node dist/index.js",
#     "dev": "concurrently \"npx tsc --watch\" \"nodemon -q dist/index.js\""
# npm i