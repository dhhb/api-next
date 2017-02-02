import moment from 'moment';
import supertest from 'supertest-as-promised';
import superagentDefaults from 'superagent-defaults';
import { app } from '../src';

export function createTestEmail() {
  return moment().valueOf() + '@tests.com';
}

export function createTestUserData(roles = ['writer']) {
  return {
    email: createTestEmail(),
    password: 'qwerty',
    name: 'John Doe',
    roles
  };
}

export function createJsonApiRecord(type, id, attributes) {
  if (id && !attributes) {
    attributes = id;
    id = void 0;
  }

  const jsonData = { data: { type, attributes } };

  if (id) {
    jsonData.data.id = id;
  }

  return jsonData;
}

export function createJsonApiRequest() {
  const superagent = superagentDefaults(supertest(app));
  superagent.set('Content-Type', 'application/vnd.api+json');
  return superagent;
}
