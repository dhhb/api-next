import http from 'http';
import cors from 'cors';
import logger from 'morgan';
import express from 'express';
import { host, port, env } from 'c0nfig';
import v1 from './v1';

const app = express();

if ('test' !== env) {
    app.use(logger('dev'));
}

app.use(cors());
app.use('/v1', v1());

http.createServer(app).listen(port, () => {
    console.log(`api is listening on http://${host}:${port} env=${env}`);
});
