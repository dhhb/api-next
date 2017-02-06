import fortune from 'fortune';
import mongodbAdapter from 'fortune-mongodb';
import isFunction from 'lodash/isFunction';
import { randomBytes } from 'crypto';
import { mongodb } from 'c0nfig';
import * as types from './types';

const typeMap = {}; // map record type names to collection names
const hooks = {}; // adapter i/o hooks
const recordTypes = {}; // adapter record types
const recordIndexes = []; // mongodb collection indexes per record type
const beforeRequestHooks = {}; // before request hooks

Object.keys(types).forEach(key => {
  const type = types[key];

  recordTypes[type.name] = type.definition;
  hooks[type.name] = [type.input, type.output];

  if (type.collection) {
    typeMap[type.name] = type.collection;
  }

  if (type.index) {
    recordIndexes.push({
      collection: type.collection,
      index: type.index
    });
  }

  if (isFunction(type.beforeRequest)) {
    beforeRequestHooks[type.name] = type.beforeRequest;
  }
});

// create database adapter
const adapter = [
  mongodbAdapter, {
    url: mongodb.connection,
    generateId() {
      return randomBytes(16).toString('hex');
    },
    typeMap
  }
];

// create fortune store instance
const store = fortune(recordTypes, { adapter, hooks });

// patch request with before hook
const internalRequest = store.request;

store.request = async function (options) {
  const beforeRequestHook = beforeRequestHooks[options.type];

  if (beforeRequestHook) {
    await beforeRequestHook(options);
  }

  return internalRequest.call(this, options);
};

// ensure mongodb collection indexes
store.on(fortune.events.connect, () => {
  recordIndexes.forEach(record => {
    const db = store.adapter.db;
    const { keys, options } = record.index;

    db.collection(record.collection).createIndex(keys, options);
  });
});

store.connect();

export default store;
