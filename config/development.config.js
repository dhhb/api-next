module.exports = {
    port: 9876,
    host: 'localhost',
    mongo: {
        host: '$(host)',
        name: 'dhhb-fortune-dev',
        port: 27017,
        connection: 'mongodb://$(mongodb.host):$(mongodb.port)/$(mongodb.name)',
        options: {}
    }
};
