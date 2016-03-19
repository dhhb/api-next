import express from 'express';
import fortune from 'fortune';
import store from './store';

export default function () {
    const router = express.Router();
    const listener = fortune.net.http(store);

    router.use(listener);

    return router;
}
