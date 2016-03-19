import express from 'express';
import fortune from 'fortune';
import jsonApiSerializer from 'fortune-json-api';
import store from './store';

export default function () {
    const router = express.Router();
    const listener = fortune.net.http(store, {
        serializers: [
            [jsonApiSerializer, {}]
        ]
    });

    router.use(listener);

    return router;
}
