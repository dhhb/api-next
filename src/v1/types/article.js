import fortune from 'fortune';
import config from 'c0nfig';
import parseDataURI from 'parse-data-uri';
import * as schemas from '../schemas';
import { auth, files } from '../utils';

const findMethod = fortune.methods.find;
const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;

const BadRequestError = fortune.errors.BadRequestError;

const allowedMimetypes = ['image/png', 'image/jpeg'];

const recordType = {
  name: 'article',

  collection: 'articles',

  definition: {
    title: String,
    intro: String,
    content: String,
    coverUrl: String,
    createdAt: Date,
    updatedAt: Date,
    publishedAt: Date,
    keywords: Array(String),
    draft: Boolean,
    author: ['user', 'articles']
  },

  async beforeRequest(request) {
    const method = request.method;
    const headers = request.meta.headers;

    if (method === findMethod) {
      if (headers.authorization) {
        await auth.validateToken(request);
      } else {
        // Prevent this option from being overridden.
        request.options.match = Object.create({}, {
          draft: { value: false, enumerable: true }
        });
      }
    }
  },

  async input(context, record, update) {
    const method = context.request.method;
    const user = await auth.validateToken(context.request);

    if (method === createMethod) {
      schemas.validate(record, schemas.article.create);

      record.author = user.id;
      record.draft = true;

      const now = new Date();

      record.createdAt = now;
      record.updatedAt = now;

      return record;
    }

    if (method === updateMethod) {
      schemas.validate(update.replace, schemas.article.update);

      update.replace.updatedAt = new Date();

      if (update.replace.publish) {
        update.replace.draft = false;
        update.replace.publishedAt = new Date();
      }

      if (update.replace.coverData) {
        const parsed = parseDataURI(update.replace.coverData);

        if (allowedMimetypes.indexOf(parsed.mimeType) < 0) {
          throw new BadRequestError(`Cover data has unsupported mimetype - "${parsed.mimeType}"`);
        }

        const fileKey = `articles/${record.id}/cover`;

        update.replace.coverUrl = await files.upload(parsed.data, parsed.mimeType, fileKey);
      }

      return update;
    }

    return null;
  },

  async output(context, record) {
    if (record.coverUrl) {
      record.coverUrl = `${config.staticFilesUrl}/${record.coverUrl}`;
    } else {
      delete record.coverUrl;
    }

    if (record.draft) {
      delete record.publishedAt;
    }

    record.accessedAt = new Date();

    return record;
  }
};

export default recordType;
