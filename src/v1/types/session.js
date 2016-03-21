import fortune from 'fortune';
import config from 'c0nfig';
import * as types from '../utils/types';
import * as token from '../utils/token';
import * as passwords from '../utils/passwords';

const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;

const NotFoundError = fortune.errors.NotFoundError;
const BadRequestError = fortune.errors.BadRequestError;

const recordType = {
    name: 'session',

    collection: 'sessions',

    definition: {
        token: {
            type: types.Base64
        },
        expireAt: {
            type: Date
        }
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
            delete record.id;
            delete record.token;

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
            const same = await passwords.compare(record.password, user.password);
            if (!same) {
                throw new BadRequestError('Passwords do not match');
            }

            record.id = token.generate(user);
            record.token = token.generate(user);
            record.expireAt = new Date(Date.now() + config.auth.tokenTTL);
            return record;
        }

        if (method === updateMethod) {
            return record;
        }

        return null;
    },

    output(context, record) {
        return record;
    }
};

export default recordType;
