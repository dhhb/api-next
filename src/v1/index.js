import express from 'express';
import fortuneHTTP from 'fortune-http';
import chalk from 'chalk';
import jsonApiSerializer from 'fortune-json-api';
import { env } from 'c0nfig';
import store from './store';

const formDataSerializer = fortuneHTTP.FormDataSerializer;

const listener = fortuneHTTP(store, {
  serializers: [
    [jsonApiSerializer],
    [formDataSerializer]
  ]
});

const api = (req, res) => {
  return listener(req, res).catch((err) => {
    if ('development' === env) {
      console.log(chalk.red(err.stack));
    }
  });
};

export default function () {
  const router = express.Router();

  router.use(api);

  return router;
}
