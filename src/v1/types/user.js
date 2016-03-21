import fortune from 'fortune';
import * as passwords from '../utils/passwords';
import * as types from '../utils/types';

const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;

const BadRequestError = fortune.errors.BadRequestError;
const UnauthorizedError = fortune.errors.UnauthorizedError;

const recordType = {
    name: 'user',

    collection: 'users',

    definition: {
        name: {
            type: String
        },
        email: {
            type: types.Email
        },
        password: {
            type: String
        },
        pictureUrl: {
            type: String
        },
        pictureData: {
            type: Buffer
        },
        roles: {
            type: types.Enum('writer|admin'),
            isArray: true
        }
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

        // if createMethod and role writer check shared key in request
        // else throw Forbidden
        // 1. get token in request headers, validate, check role, throw error if necessary
        // 2. get token in request headers, request db, check session exists, validate, check role, throw error if necessary

        console.log('input', context.request, record, update);
        if (method === createMethod) {
            delete record.id;

            const token = validateToken(context);
            if (!token) {
                throw new UnauthorizedError('Token is expired or invalid');
            }
            const hash = await passwords.save(record.password);
            record.password = hash;
            return record;
        }

        if (method === updateMethod) {
            delete record.password;
            return update;
        }

        return null;
    },

    output(context, record) {
        console.log('output', context, record);
        delete record.password;
        delete record.pictureData;
        record.accessedAt = new Date();
        return record;
    }
};

function validateToken (context) {
    // get token from context.request
    const headers = context.request.meta.headers;
    const query = context.request.uriObject.query || {};
    const token = headers['x-access-token'] || query.access_token;

    return false;
}

export default recordType;
