const user = {
    name: 'user',

    definition: {
        name: { type: String },
        email: { type: String },
        picture: { type: String }
    },

    input() {
        console.log('input', arguments);
    },

    output() {
        console.log('output', arguments);
    }
};

export default user;
