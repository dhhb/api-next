import express from 'express';
import fortune from 'fortune';
import chalk from 'chalk';
import jsonApiSerializer from 'fortune-json-api';
import { env } from 'c0nfig';
import store from './store';

const formDataSerializer = fortune.net.http.FormDataSerializer;

const listener = fortune.net.http(store, {
    serializers: [
        [ jsonApiSerializer ],
        [ formDataSerializer ]
    ]
});

export default function () {
    const router = express.Router();

    router.use((req, res) => {
        return listener(req, res)
            .catch(error => {
                if ('development' === env) console.log(chalk.red(error.stack));
            });
    });

    return router;
}
