import http from 'http';
import cors from 'cors';
import logger from 'morgan';
import express from 'express';
import compression from 'compression';
import { host, port, env, mongodb } from 'c0nfig';
import v1 from './v1';

export const app = express();

if ('test' !== env) {
  app.use(logger('dev'));
}

app.disable('x-powered-by');
app.use(cors());
app.use(compression());
app.use('/v1', v1());

export function start() {
  http.createServer(app).listen(port, () => {
    console.log(`api server is listening on http://${host}:${port} env=${env} db=${mongodb.connection}`);
  });
}
