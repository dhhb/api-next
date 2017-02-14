import test from 'ava';
import _ from 'lodash';
import config from 'c0nfig';
import {
  createTestUserData,
  createJsonApiRecord,
  createJsonApiRequest
} from '../testUtils';

let request;
let userDataI;
let userDataII;
let userIdI;
let userIdII;
let tokenId;

test.before('create request instance', () => {
  request = createJsonApiRequest();
});

test.before('create test user data', () => {
  userDataI = createTestUserData();
  userDataII = createTestUserData();
});

test.before('POST /users (register user I)', async t => {
  const res = await request
    .post('/v1/users')
    .query({shared_key: config.auth.sharedKey})
    .send(createJsonApiRecord('user', userDataI));

  t.is(res.status, 201);
  t.truthy(res.body.data);
  t.truthy(res.body.data.id);
  t.truthy(res.body.data.attributes);

  userIdI = res.body.data.id;
});

test.before('POST /users (register user II)', async t => {
  const res = await request
    .post('/v1/users')
    .query({shared_key: config.auth.sharedKey})
    .send(createJsonApiRecord('user', userDataII));

  t.is(res.status, 201);
  t.truthy(res.body.data);
  t.truthy(res.body.data.id);
  t.truthy(res.body.data.attributes);

  userIdII = res.body.data.id;
});

test.before('POST /tokens (login user I)', async t => {
  const res = await request
    .post('/v1/tokens')
    .send(createJsonApiRecord('token', {
      email: userDataI.email,
      password: userDataI.password
    }));

  t.is(res.status, 201);
  t.truthy(res.body.data);
  t.truthy(res.body.data.id);
  t.truthy(res.body.data.attributes);

  tokenId = res.body.data.id;
});

test('DELETE /users without token', async t => {
  const res = await request
    .del(`/v1/users/${userIdI}`);

  t.is(res.status, 400,
    'should respond with 400 status');
  t.true(_.isArray(res.body.errors),
    'should have errors as array');
  t.is(res.body.errors[0].detail, 'Token is missing',
    'should respond with correct error message');
});

test('DELETE /users with invalid token', async t => {
  const res = await request
    .set('Authorization', 'Invalid token id')
    .del(`/v1/users/${userIdI}`);

  t.is(res.status, 401,
    'should respond with 401 status');
  t.true(_.isArray(res.body.errors),
    'should have errors as array');
  t.is(res.body.errors[0].detail, 'Token is expired or incorrect',
    'should respond with correct error message');
});

test('DELETE /users without corresponding token', async t => {
  const res = await request
    .set('Authorization', tokenId)
    .del(`/v1/users/${userIdII}`);

  t.is(res.status, 403,
    'should respond with 400 status');
  t.true(_.isArray(res.body.errors),
    'should have errors as array');
  t.is(res.body.errors[0].detail, 'Token is not valid for this user',
    'should respond with correct error message');
});

test('DELETE /users with valid token', async t => {
  const res = await request
    .set('Authorization', tokenId)
    .del(`/v1/users/${userIdI}`);

  t.is(res.status, 204,
    'should respond with 204 status');
});
