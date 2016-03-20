import isEmail from 'validator/lib/isEmail';

export const Email = (value) => {
    return isEmail(value);
};

export const Enum = (values = []) => {
    if (!Array.isArray(values)) {
        values = values.split('|');
    }
    return function Enum (value) {
        return values.indexOf(value) > -1;
    };
};
