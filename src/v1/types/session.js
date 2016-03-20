import fortune from 'fortune';
import token from '../../utils/token';

const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;

const recordType = {
    name: 'session',

    collection: 'sessions',

    definition: {
        token: {
            type: Date
        }
    },

    input(context, record, update) {
        const method = context.request.method;
        if (method === createMethod) {
            // find user by email
            record.expireAt = Date.now();
            console.log('adapter', context, record);
            return {};
        }
        return null;
    },

    output(context, record) {
        console.log(record);
        delete record.password;
        return record;
    }
};

export default recordType;
