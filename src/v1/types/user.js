import fortune from 'fortune';
import bcrypt from 'bcrypt';
import config from 'c0nfig';
import { Email, Enum } from './customTypesUtil';

const { bcryptHashRounds } = config.auth;

const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;

const BadRequestError = fortune.errors.BadRequestError;

function savePassword (password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(bcryptHashRounds, (err, salt) => {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

const recordType = {
    name: 'user',

    collection: 'users',

    definition: {
        name: {
            type: String
        },
        email: {
            type: Email
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
            type: Enum('writer|admin'),
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

    input(context, record, update) {
        const method = context.request.method;

        console.log('input', context.request.meta, record, update);
        if (method === createMethod) {
            delete record.id;

            return savePassword(record.password)
                .then(passwordHash => {
                    record.password = passwordHash;
                    return record;
                });
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

export default recordType;
