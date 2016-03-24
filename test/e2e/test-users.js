import test from 'ava';
import _ from 'lodash';
import {
    createTestEmail,
    createJsonApiRecord,
    createJsonApiRequest
} from '../testUtils';

let data;
let users;

test.before(() => {
    users = createJsonApiRequest('/v1/users');
});

test.beforeEach(() => {
    data = createJsonApiRecord('user', {
        email: createTestEmail(),
        password: 'qwerty'
    });
});

test('create user without shared key', async t => {
    const res = await users
        .post('/v1/users')
        .set('Content-Type', 'application/vnd.api+json')
        .send(data);

    t.is(res.status, 400);
    t.true(_.isArray(res.body.errors));
    t.is(res.body.errors[0].detail, 'Shared key is missing');
});

test('create user with invalid shared key', async t => {
    const res = await users
        .post('/v1/users')
        .set('Content-Type', 'application/vnd.api+json')
        .query({'shared_key': '12345'})
        .send(data);

    t.is(res.status, 401);
    t.true(_.isArray(res.body.errors));
    t.is(res.body.errors[0].detail, 'Shared key is incorrect');
});

test.todo('create user with valid shared key', t => {

});

test.todo('create user with data not matching schema', t => {

});

test.todo('create user with data matching schema', t => {

});
