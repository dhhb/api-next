import test from 'ava';
import _ from 'lodash';
import config from 'c0nfig';
import {
  createTestUserData,
  createTestArticleData,
  createJsonApiRecord,
  createJsonApiRequest
} from '../testUtils';

let request;
let userData;
let articleData;
let userId;
let tokenId;
let articleId;

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

test.before('create test user data', () => {
  articleData = createTestArticleData();
});

test.before('POST /articles (create article)', async t => {
  const res = await request
    .post('/v1/articles')
    .set('Authorization', tokenId)
    .send(createJsonApiRecord('article', articleData));

  t.is(res.status, 201);
  t.truthy(res.body.data);
  t.truthy(res.body.data.id);
  t.is(res.body.data.attributes.title, articleData.title);
  t.is(res.body.data.attributes.intro, articleData.intro);
  t.is(res.body.data.attributes.content, articleData.content);
  t.deepEqual(res.body.data.attributes.keywords, articleData.keywords);

  articleId = res.body.data.id;
});

test('PATCH /articles without token', async t => {
  const res = await request
    .patch(`/v1/articles/${articleId}`)
    .send(createJsonApiRecord('article', articleId, articleData));

  t.is(res.status, 400,
    'should respond with 400 status');
  t.true(_.isArray(res.body.errors),
    'should have errors as array');
  t.is(res.body.errors[0].detail, 'Token is missing',
    'should respond with correct error message');
});

test('PATCH /articles with invalid token', async t => {
  const res = await request
    .patch(`/v1/articles/${articleId}`)
    .set('Authorization', 'Invalid token id')
    .send(createJsonApiRecord('article', articleId, articleData));

  t.is(res.status, 401,
    'should respond with 401 status');
  t.true(_.isArray(res.body.errors),
    'should have errors as array');
  t.is(res.body.errors[0].detail, 'Token is expired or incorrect',
    'should respond with correct error message');
});

test('PATCH /articles with valid token', async t => {
  const newData = {
    title: 'New test title!',
    publish: true
  };
  const res = await request
    .patch(`/v1/articles/${articleId}`)
    .set('Authorization', tokenId)
    .send(createJsonApiRecord('article', articleId, newData));

  t.is(res.status, 200,
    'should respond with 200 status');
  t.truthy(res.body.data,
    'should have data property');
  t.truthy(res.body.data.id,
    'should have article id property');
  t.is(res.body.data.attributes.title, newData.title,
    'should have title value');
  t.is(res.body.data.attributes.intro, articleData.intro,
    'should have intro value');
  t.is(res.body.data.attributes.content, articleData.content,
    'should have content value');
  t.false(res.body.data.attributes.draft,
    'should have draft as "false" value');
  t.deepEqual(res.body.data.attributes.keywords, articleData.keywords,
    'should have keywords value');
});

