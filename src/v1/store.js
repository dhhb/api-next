import fortune from 'fortune';
import mongodbAdapter from 'fortune-mongodb';
import { randomBytes } from 'crypto';
import { mongo } from 'c0nfig';
import * as types from './types';

const typeMap = {};
const transforms = {};
const recordTypes = {};
const recordIndexes = [];
Object.keys(types).forEach(key => {
    const type = types[key];

    recordTypes[type.name] = type.definition;
    transforms[type.name] = [type.input, type.output];

    if (type.collection) {
        typeMap[type.name] = type.collection;
    }

    if (type.index) {
        recordIndexes.push({
            collection: type.collection,
            index: type.index
        });
    }
});

const adapter = [
    mongodbAdapter,
    {
        url: mongo.connection,
        generateId() {
            return randomBytes(12).toString('hex');
        },
        typeMap
    }
];
const store = fortune(recordTypes, { adapter, transforms });

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
