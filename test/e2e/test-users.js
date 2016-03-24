import test from 'ava';
import _ from 'lodash';
import {
    createTestEmail,
    createJsonApiRecord,
    createJsonApiRequest
} from '../testUtils';

let data;
let request;

test.before(() => {
    request = createJsonApiRequest('/v1/request');
});

test.beforeEach(() => {
    data = createJsonApiRecord('user', {
        email: createTestEmail(),
        password: 'qwerty'
    });
});

test('create user without shared key', async t => {
    const res = await request
        .post('/v1/users')
        .send(data);

    t.is(res.status, 400);
    t.true(_.isArray(res.body.errors));
    t.is(res.body.errors[0].detail, 'Shared key is missing');
});

test('create user with invalid shared key', async t => {
    const res = await request
        .post('/v1/users')
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
