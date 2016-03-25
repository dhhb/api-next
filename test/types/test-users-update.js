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

test('update user without token', async t => {

});

test('update user with invalid token', async t => {

});

test('update user with valid token but not matching schema', async t => {

});

test('update user with valid token and matching schema', async t => {

});
