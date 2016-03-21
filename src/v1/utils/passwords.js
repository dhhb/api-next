import bcrypt from 'bcrypt';
import config from 'c0nfig';

const { bcryptHashRounds } = config.auth;

export function save (password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(bcryptHashRounds, (err, salt) => {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

export function compare (password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, same) => {
            return err ? reject(err) : resolve(same);
        });
    });
}
