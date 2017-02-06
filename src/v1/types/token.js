import fortune from 'fortune';
import config from 'c0nfig';
import * as schemas from '../schemas';
import { passwords } from '../utils';

const findMethod = fortune.methods.find;
const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;

const NotFoundError = fortune.errors.NotFoundError;
const ForbiddenError = fortune.errors.ForbiddenError;
const BadRequestError = fortune.errors.BadRequestError;

const recordType = {
  name: 'token',

  collection: 'tokens',

  definition: {
    userId: String,
    expireAt: Date
  },

  index: {
    keys: {
      expireAt: 1
    },
    options: {
      expireAfterSeconds: 0
    }
  },

  async input(context, record) {
    const method = context.request.method;

    if (method === createMethod) {
      schemas.validate(record, schemas.token.create);

      const users = await context.transaction.find('user', null, {
        match: {
          email: record.email
        },
        fields: {
          name: true,
          email: true,
          password: true,
          pictureUrl: true,
          roles: true
        }
      });

      if (!users.count) {
        throw new NotFoundError(`There is no user with email - ${record.email}`);
      }

      const [ user ] = users;
      const same = await passwords.compare(record.password.toString(), user.password);

      if (!same) {
        throw new BadRequestError('Passwords do not match');
      }

      record.userId = user.id;
      record.expireAt = new Date(Date.now() + config.auth.tokenTTL);

      return record;
    }

    if (method === updateMethod) {
      throw new ForbiddenError('Tokens cannot be updated');
    }

    return null;
  },

  output(context, record) {
    const method = context.request.method;

    if (method === findMethod) {
      throw new ForbiddenError('Tokens access is not allowed');
    }

    return record;
  }
};

export default recordType;
