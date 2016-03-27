import test from 'ava';
import _ from 'lodash';
import config from 'c0nfig';
import {
    createTestUserData,
    createJsonApiRecord,
    createJsonApiRequest
} from '../testUtils';

let request;
let userData;
let userId;
let tokenId;

test.before('create request instance', () => {
    request = createJsonApiRequest();
});

test.before('create test user data', () => {
    userData = createTestUserData();
});

test.before('POST /users (register user)', async t => {
    const sendData = createJsonApiRecord('user', userData);
    const res = await request
        .post('/v1/users')
        .query({shared_key: config.auth.sharedKey})
        .send(sendData);

    t.is(res.status, 201);
    t.ok(res.body.data);
    t.ok(res.body.data.id);
    t.ok(res.body.data.attributes);

    userId = res.body.data.id;
});

test.before('POST /tokens (login user)', async t => {
    const sendData = createJsonApiRecord('token', {
        email: userData.email,
        password: userData.password
    });

    const res = await request
        .post('/v1/tokens')
        .send(sendData);

    t.is(res.status, 201);
    t.ok(res.body.data);
    t.ok(res.body.data.id);
    t.ok(res.body.data.attributes);

    tokenId = res.body.data.id;
});

test('PATCH /users without token', async t => {
    const res = await request
        .patch(`/v1/users/${userId}`)
        .send(createJsonApiRecord('user', userId, {name: 'New name'}));

    t.is(res.status, 400,
        'should respond with 400 status');
    t.true(_.isArray(res.body.errors),
        'should have errors as array');
    t.is(res.body.errors[0].detail, 'Token is missing',
        'should respond with correct error message');
});

test('PATCH /users with invalid token', async t => {
    const res = await request
        .patch(`/v1/users/${userId}`)
        .set('Authorization', 'Invalid token id')
        .send(createJsonApiRecord('user', userId, {name: 'New name'}));

    t.is(res.status, 401,
        'should respond with 401 status');
    t.true(_.isArray(res.body.errors),
        'should have errors as array');
    t.is(res.body.errors[0].detail, 'Token is expired or incorrect',
        'should respond with correct error message');
});

test('PATCH /users with valid token but not matching schema', async t => {
    const res = await request
        .patch(`/v1/users/${userId}`)
        .set('Authorization', tokenId)
        .send(createJsonApiRecord('user', userId, {pictureData: 'foo'}));

    t.is(res.status, 400,
        'should respond with 400 status');
    t.true(_.isArray(res.body.errors),
        'should have errors as array');
    t.is(res.body.errors[0].detail, 'Error validating against schema',
        'should respond with correct error message');
    t.is(res.body.errors[0].schema.length, 1,
        'should have all schema errors');
});

test('PATCH /users with valid token and matching schema', async t => {
    const newData = {name: 'Super new name', email: 'trysend@newemail.com'};
    const res = await request
        .patch(`/v1/users/${userId}`)
        .set('Authorization', tokenId)
        .send(createJsonApiRecord('user', userId, newData));

    t.is(res.status, 200,
        'should respond with 200 status');

    // const res2 = await request.get(`/v1/users/${userId}`);

    // t.is(res2.status, 200,
        // 'should respond with 200 status');
    t.ok(res.body.data,
        'should have data property');
    t.is(res.body.data.id, userId,
        'should have user id property');
    t.is(res.body.data.attributes.name, newData.name,
        'should have new name value');
    t.is(res.body.data.attributes.email, userData.email,
        'should have old email value');
});
