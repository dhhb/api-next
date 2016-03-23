import fortune from 'fortune';
import * as schemas from '../schemas';
import { types, auth, passwords } from '../utils';

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
            auth.validateSharedKey(context);
            schemas.validate(record, schemas.user.create);

            const hash = await passwords.save(record.password);
            record.password = hash;
            return record;
        }

        if (method === updateMethod) {
            await auth.validateToken(context);
            schemas.validate(update.replace, schemas.user.update);

            if (record.pictureData) {
                // upload image to s3 and save url as pictureUrl
                // consider creating static service to urls look list static.r-o-b.media/bucket/image/etc
                console.log('pictureData!');
            }

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
