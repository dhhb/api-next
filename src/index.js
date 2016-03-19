import http from 'http';
import cors from 'cors';
import logger from 'morgan';
import express from 'express';
import compression from 'compression';
import { host, port, env } from 'c0nfig';

const app = express();

if ('test' !== env) {
    app.use(logger('dev'));
}

app.use(cors());
app.use(compression());

app.use((req, res) => res.json({fortune: true}));

http.createServer(app).listen(port, () => {
    console.log(`api is listening on http://${host}:${port} env=${env}`);
});
