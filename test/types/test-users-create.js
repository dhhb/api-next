import test from 'ava';
import _ from 'lodash';
import config from 'c0nfig';
import {
    createTestUserData,
    createJsonApiRecord,
    createJsonApiRequest
} from '../testUtils';

let sendData;
let userData;
let request;

test.before(() => {
    request = createJsonApiRequest();
});

test.beforeEach(() => {
    userData = createTestUserData();
    sendData = createJsonApiRecord('user', userData);
});

test('create user without shared key', async t => {
    const res = await request
        .post('/v1/users')
        .send(sendData);

    t.is(res.status, 400);
    t.true(_.isArray(res.body.errors));
    t.is(res.body.errors[0].detail, 'Shared key is missing');
});

test('create user with invalid shared key', async t => {
    const res = await request
        .post('/v1/users')
        .query({shared_key: '12345'})
        .send(sendData);

    t.is(res.status, 401);
    t.true(_.isArray(res.body.errors));
    t.is(res.body.errors[0].detail, 'Shared key is incorrect');
});

test('create user with valid shared key but not matching schema', async t => {
    const notValid = createJsonApiRecord('user', {email: 'foo', password: 'qwert'});
    const res = await request
        .post('/v1/users')
        .query({shared_key: config.auth.sharedKey})
        .send(notValid);

    t.is(res.status, 400);
    t.true(_.isArray(res.body.errors));
    t.is(res.body.errors[0].detail, 'Error validating against schema');
    t.is(res.body.errors[0].schema.length, 4);
});

test('create user with valid shared key and matching schema', async t => {
    const res = await request
        .post('/v1/users')
        .query({shared_key: config.auth.sharedKey})
        .send(sendData);

    t.is(res.status, 201);
    t.ok(res.body.data);
    t.is(res.body.data.attributes.name, userData.name);
    t.is(res.body.data.attributes.email, userData.email);
    t.is(res.body.data.attributes['picture-url'], `${config.staticFilesUrl}/defaults/avatar`);
    t.is(res.body.data.attributes.roles.join(','), userData.roles.join(','));
});
