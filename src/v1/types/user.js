import fortune from 'fortune';
import * as schemas from '../schemas';
import { types, auth, passwords } from '../utils';

console.log(schemas);

const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;

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
            type: types.Base64
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

        if (method === createMethod) {
            delete record.id;
            delete record.pictureUrl;
            delete record.pictureData;

            auth.validateSharedKey(context);
            schemas.validate(record, schemas.user.create);

            const hash = await passwords.save(record.password);
            record.password = hash;
            return record;
        }

        if (method === updateMethod) {
            delete record.roles;
            delete record.password;
            delete record.pictureUrl;

            await auth.validateToken(context);

            return update;
        }

        return null;
    },

    output(context, record) {
        delete record.password;
        delete record.pictureData;
        record.accessedAt = new Date();
        return record;
    }
};

export default recordType;
