import AWS from 'aws-sdk';
import config from 'c0nfig';

AWS.config.update({
    accessKeyId: config.s3.key,
    secretAccessKey: config.s3.secret
});

export function upload (body, mimetype, key) {
    const s3bucket = new AWS.S3({
        params: {
            Bucket: config.s3.bucket,
            ACL: 'public-read',
            ContentType: mimetype
        }
    });

    return new Promise((resolve, reject) => {
        s3bucket.upload({
            Key: key,
            Body: body
        }, (err, data) => {
            if (err) {
                return reject(err);
            }
            console.log(data);
            const fileUrl = 'http://static.r-o-b.media/bucket';
            resolve(fileUrl);
        });
    });
}
