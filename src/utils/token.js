import jwt from 'jsonwebtoken';
import config from 'c0nfig';

const { env } = config;
const { signKey, tokenTTL } = config.auth;

export function generate (user) {
    const token = jwt.sign(user, signKey, {expiresIn: tokenTTL / 1000});
    const tokenBase64 = new Buffer(token).toString('base64');
    return tokenBase64;
}

export function validate (token) {
    try {
        const decoded = new Buffer(token, 'base64').toString();
        const user = jwt.verify(decoded, signKey);
        return user;
    } catch (err) {
        if (env !== 'test') {
            console.error(err);
        }
    }
    return false;
}
