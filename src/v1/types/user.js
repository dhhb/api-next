import fortune from 'fortune';
import { Email, Enum } from './customTypesUtil';

const createMethod = fortune.methods.create;
const updateMethod = fortune.methods.update;

const user = {
    name: 'user',

    collection: 'users',

    definition: {
        name: {
            type: String
        },
        email: {
            type: Email
        },
        picture: {
            type: String
        },
        role: {
            type: Enum('writer|admin')
        }
    },

    input(context, record, update) {
        const method = context.request.method;

        // validate schema for create and update
        // check authorization for create and update

        console.log('input', context, record, update);
        // If it's a create request, return the record.
        if (method === createMethod) return record;

        // If the update argument exists, it's an update request.
        if (method === updateMethod) return update;

        // Otherwise, it's a delete request and the return value doesn't matter.
        return null;
    },

    output(context, record) {
        console.log('output', context, record);
        record.accessedAt = new Date();
        return record;
    }
};

export default user;
