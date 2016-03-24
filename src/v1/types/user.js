import fortune from 'fortune';
import parseDataURI from 'parse-data-uri';
import * as schemas from '../schemas';
import { types, auth, passwords, files } from '../utils';

const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;

const ForbiddenError = fortune.errors.ForbiddenError;
const BadRequestError = fortune.errors.BadRequestError;

const allowedMimetypes = ['image/png', 'image/jpeg'];

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
            if (update.push || update.pull) {
                throw new ForbiddenError('Invalid update.');
            }

            await auth.validateToken(context);
            schemas.validate(update.replace, schemas.user.update);

            if (update.replace.pictureData) {
                // upload image to s3 and save url as pictureUrl
                // consider creating static service to urls look list static.r-o-b.media/bucket/image/etc
                const parsed = parseDataURI(update.replace.pictureData);
                if (allowedMimetypes.indexOf(parsed.mimeType) < 0) {
                    throw new BadRequestError(`Picture data has unsupported mimetype - "${parsed.mimeType}"`);
                }

                const filePath = 'test-path-2';
                update.replace.pictureUrl = await files.upload(parsed.data, parsed.mimeType, filePath);
                delete update.replace.pictureData;
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
