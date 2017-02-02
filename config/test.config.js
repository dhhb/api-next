module.exports = {
  port: process.env.PORT || 9876,
  host: 'localhost',
  apiUrl: 'http://$(host):$(port)/v1',
  staticFilesUrl: 'http://localhost:9877/s3',
  mongo: {
    host: '$(host)',
    name: 'dhhb-fortune-test',
    port: 27017,
    connection: 'mongodb://$(mongo.host):$(mongo.port)/$(mongo.name)',
    options: {}
  },
  auth: {
    cookieName: 'access_token_test',
    signKey: 'abcdef1234567890',
    sharedKey: '1234567890abcdef',
    tokenTTL: 1000 * 60, // 1 min
    resetPasswordTTL: 1000 * 60, // 1 min
    bcryptHashRounds: 0
  },
  s3: {
    key: process.env.S3_KEY,
    secret: process.env.S3_SECRET,
    bucket: 'dhhb-dev',
    bucketUrl: 'http://$(s3.bucket).s3.amazonaws.com',
    url: 'https://s3.amazonaws.com'
  }
};
