module.exports = {
    port: process.env.PORT || 9876,
    host: 'localhost',
    mongo: {
        host: '$(host)',
        name: 'dhhb-fortune-dev',
        port: 27017,
        connection: 'mongodb://$(mongo.host):$(mongo.port)/$(mongo.name)',
        options: {}
    },
    auth: {
        cookieName: 'access_token',
        signKey: '9bddfe0adf7bfc936adf4e19ed568dafe5f03d28',
        sharedKey: '18906320497eaad0088501a1b6f5485e33a4172b',
        tokenTTL: 1000 * 60 * 60 * 24 * 30 * 1, // 1 month
        resetPasswordTTL: 1000 * 60 * 60 * 24, // 1 day
        bcryptHashRounds: 10
    }
};
