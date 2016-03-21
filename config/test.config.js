module.exports = {
    port: process.env.PORT || 9876,
    host: 'localhost',
    mongo: {
        host: '$(host)',
        name: 'dhhb-fortune-test',
        port: 27017,
        connection: 'mongodb://$(mongo.host):$(mongo.port)/$(mongo.name)',
        options: {}
    },
    auth: {
        cookieName: 'access_token_test',
        signKey: '2c8452ca589f3a38f161568681ccfe46f6362bff',
        tokenTTL: 1000 * 60 * 60 * 24 * 30 * 6, // 6 months
        resetPasswordTTL: 1000 * 60 * 60 * 24, // 1 day
        bcryptHashRounds: 0
    }
};
