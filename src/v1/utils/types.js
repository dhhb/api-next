import isEmail from 'validator/lib/isEmail';
import isBase64 from 'validator/lib/isBase64';

export const Email = (value) => {
    return isEmail(value.trim());
};

export const Enum = (values = []) => {
    if (!Array.isArray(values)) {
        values = values.split('|');
    }
    return function Enum (value) {
        return values.indexOf(value.trim()) > -1;
    };
};

export const Base64 = (value) => {
    return isBase64(value.trim());
};

const dataURIRegex = /^\s*data:([a-z]+\/[a-z0-9\-\+]+(;[a-z\-]+\=[a-z0-9\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
export const DataURI = (value) => {
    return dataURIRegex.test(value.trim());
};
