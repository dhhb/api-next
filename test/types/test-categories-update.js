import test from 'ava';
import _ from 'lodash';
import config from 'c0nfig';
import {
  createTestUserData,
  createTestCategoryData,
  createJsonApiRecord,
  createJsonApiRequest
} from '../testUtils';

let request;
let userData;
let categoryData;
let userId;
let tokenId;
let categoryId;

test.before('create request instance', () => {
  request = createJsonApiRequest();
});

test.before('create test user data', () => {
  userData = createTestUserData();
});

test.before('POST /users (register user)', async t => {
  const res = await request
    .post('/v1/users')
    .query({shared_key: config.auth.sharedKey})
    .send(createJsonApiRecord('user', userData));

  t.is(res.status, 201);
  t.truthy(res.body.data);
  t.truthy(res.body.data.id);
  t.truthy(res.body.data.attributes);

  userId = res.body.data.id;
});

test.before('POST /tokens (login user)', async t => {
  const res = await request
    .post('/v1/tokens')
    .send(createJsonApiRecord('token', {
      email: userData.email,
      password: userData.password
    }));

  t.is(res.status, 201);
  t.truthy(res.body.data);
  t.truthy(res.body.data.id);
  t.truthy(res.body.data.attributes);

  tokenId = res.body.data.id;
});

test.before('create test category data', () => {
  categoryData = createTestCategoryData();
});

test.before('POST /categories (create category)', async t => {
  const res = await request
    .post('/v1/categories')
    .set('Authorization', tokenId)
    .send(createJsonApiRecord('category', categoryData));

  t.is(res.status, 201);
  t.truthy(res.body.data);
  t.truthy(res.body.data.id);
  t.is(res.body.data.attributes.title, categoryData.title);

  categoryId = res.body.data.id;
});

test('PATCH /categories without token', async t => {
  const res = await request
    .patch(`/v1/categories/${categoryId}`)
    .send(createJsonApiRecord('category', categoryId, categoryData));

  t.is(res.status, 400,
    'should respond with 400 status');
  t.true(_.isArray(res.body.errors),
    'should have errors as array');
  t.is(res.body.errors[0].detail, 'Token is missing',
    'should respond with correct error message');
});

test('PATCH /categories with invalid token', async t => {
  const res = await request
    .patch(`/v1/categories/${categoryId}`)
    .set('Authorization', 'Invalid token id')
    .send(createJsonApiRecord('category', categoryId, categoryData));

  t.is(res.status, 401,
    'should respond with 401 status');
  t.true(_.isArray(res.body.errors),
    'should have errors as array');
  t.is(res.body.errors[0].detail, 'Token is expired or incorrect',
    'should respond with correct error message');
});

test('PATCH /categories with valid token', async t => {
  const newData = {
    title: 'New test title!'
  };
  const res = await request
    .patch(`/v1/categories/${categoryId}`)
    .set('Authorization', tokenId)
    .send(createJsonApiRecord('category', categoryId, newData));

  t.is(res.status, 204,
    'should respond with 204 status');
});
