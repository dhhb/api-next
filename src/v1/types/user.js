import fortune from 'fortune';
import config from 'c0nfig';
import parseDataURI from 'parse-data-uri';
import * as schemas from '../schemas';
import { types, auth, passwords, files } from '../utils';

const findMethod = fortune.methods.find;
const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;

const ForbiddenError = fortune.errors.ForbiddenError;
const BadRequestError = fortune.errors.BadRequestError;

const allowedMimetypes = ['image/png', 'image/jpeg'];

const recordType = {
  name: 'user',

  collection: 'users',

  definition: {
    name: String,
    email: types.Email,
    password: String,
    pictureUrl: String,
    roles: Array(types.Enum('writer|admin')),
    articles: [Array('article'), 'author']
  },

  index: {
    keys: {
      email: 1
    },
    options: {
      unique: true
    }
  },

  async input(context, record, update) {
    const method = context.request.method;

    if (method === createMethod) {
      auth.validateSharedKey(context.request);
      schemas.validate(record, schemas.user.create);

      const hash = await passwords.save(record.password);

      record.password = hash;

      return record;
    }

    if (method === updateMethod) {
      if (update.push || update.pull) {
        throw new ForbiddenError('Invalid update');
      }

      const user = await auth.validateToken(context.request);

      schemas.validate(update.replace, schemas.user.update);

      if (update.replace.pictureData) {
        const parsed = parseDataURI(update.replace.pictureData);

        if (allowedMimetypes.indexOf(parsed.mimeType) < 0) {
          throw new BadRequestError(`Picture data has unsupported mimetype - "${parsed.mimeType}"`);
        }

        const fileKey = `users/${user.id}/avatar`;

        update.replace.pictureUrl = await files.upload(parsed.data, parsed.mimeType, fileKey);
      }

      return update;
    }

    return null;
  },

  async output(context, record) {
    const method = context.request.method;

    if (method === findMethod) {
      try {
        await auth.validateToken(context.request);
      } catch (e) {
        delete record.roles;
      }
    }

    delete record.password;

    if (record.pictureUrl) {
      record.pictureUrl = `${config.staticFilesUrl}/${record.pictureUrl}`;
    } else {
      record.pictureUrl = `${config.staticFilesUrl}/defaults/avatar`;
    }

    record.accessedAt = new Date();

    return record;
  }
};

export default recordType;
