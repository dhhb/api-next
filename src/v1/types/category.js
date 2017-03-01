import fortune from 'fortune';
import * as schemas from '../schemas';
import { auth } from '../utils';

const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;

const recordType = {
  name: 'category',

  collection: 'categories',

  definition: {
    title: String,
    articles: [Array('article'), 'category']
  },

  async input(context, record, update) {
    const method = context.request.method;

    await auth.validateToken(context.request);

    if (method === createMethod) {
      schemas.validate(record, schemas.category.create);

      return record;
    }

    if (method === updateMethod) {
      schemas.validate(update.replace, schemas.category.update);

      return update;
    }

    return null;
  },

  output(context, record) {
    record.accessedAt = new Date();

    return record;
  }
};

export default recordType;
