import fortune from 'fortune';
import mongodbAdapter from 'fortune-mongodb';
import { mongo } from 'c0nfig';
import * as types from './types';

const recordTypes = {};
const transforms = {};
Object.keys(types).forEach(key => {
    const t = types[key];
    recordTypes[t.name] = t.definition;
    transforms[t.name] = [t.input, t.output];
});

const adapter = [
    mongodbAdapter,
    {url: mongo.connection}
];

const store = fortune(recordTypes, adapter, transforms);

export default store;
