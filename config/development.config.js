module.exports = {
  port: process.env.NODE_PORT || process.env.PORT || 9876,
  host: 'localhost',
  apiUrl: process.env.API_URL || 'http://$(host):$(port)/v1',
  staticFilesUrl: process.env.STATIC_FILES_URL || 'http://localhost:9877/s3',
  mongodb: {
    host: process.env.MONGODB_HOST || '$(host)',
    name: process.env.MONGODB_NAME || 'dhhb-fortune-dev',
    port: process.env.MONGODB_PORT || 27017,
    connection: 'mongodb://$(mongodb.host):$(mongodb.port)/$(mongodb.name)',
    options: {}
  },
  auth: {
    cookieName: 'access_token',
    signKey: process.env.AUTH_SIGN_KEY || '9bddfe0adf7bfc936adf4e19ed568dafe5f03d28',
    sharedKey: process.env.AUTH_SHARED_KEY || '18906320497eaad0088501a1b6f5485e33a4172b',
    tokenTTL: 1000 * 60 * 60 * 24 * 30 * 1, // 1 month
    resetPasswordTTL: 1000 * 60 * 60 * 24, // 1 day
    bcryptHashRounds: 10
  },
  s3: {
    key: process.env.S3_KEY,
    secret: process.env.S3_SECRET,
    bucket: 'dhhb-dev',
    bucketUrl: 'http://$(s3.bucket).s3.amazonaws.com',
    url: 'https://s3.amazonaws.com'
  }
};
