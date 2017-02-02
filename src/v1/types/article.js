import fortune from 'fortune';
import config from 'c0nfig';

const findMethod = fortune.methods.find;
const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;

const NotFoundError = fortune.errors.NotFoundError;
const ForbiddenError = fortune.errors.ForbiddenError;
const BadRequestError = fortune.errors.BadRequestError;

const recordType = {
  name: 'article',

  collection: 'articles',

  definition: {
    title: {
      type: String
    },
    text: {
      type: String
    },
    keywords: {
      type: String,
      isArray: true
    },
    author: {
      link: 'user'
    }
  }
};

export default recordType;
