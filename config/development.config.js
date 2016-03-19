module.exports = {
    port: 9876,
    host: 'localhost',
    mongo: {
        host: '$(host)',
        name: 'dhhb-fortune-dev',
        port: 27017,
        connection: 'mongodb://$(mongo.host):$(mongo.port)/$(mongo.name)',
        options: {}
    }
};
