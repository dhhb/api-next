import fortune from 'fortune';
import mongodbAdapter from 'fortune-mongodb';
import { randomBytes } from 'crypto';
import { mongo } from 'c0nfig';
import * as types from './types';

const typeMap = {};
const transforms = {};
const recordTypes = {};
Object.keys(types).forEach(key => {
    const t = types[key];

    recordTypes[t.name] = t.definition;
    transforms[t.name] = [t.input, t.output];

    if (t.collection) {
        typeMap[t.name] = t.collection;
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

export default store;
