import fortune from 'fortune';
import validateSchema from 'is-my-schema-valid';

const BadRequestError = fortune.errors.BadRequestError;

const defaults = {
    filter: true,
    formats: {
        'data-uri': /^\s*data:([a-z]+\/[a-z0-9\-\+]+(;[a-z\-]+\=[a-z0-9\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i
    }
};

export default function validate (record, schema, options) {
    const result = validateSchema(record, schema, Object.assign({}, defaults, options));
    if (!result.valid) {
        const badRequestError = new BadRequestError('Error validating against schema');
        badRequestError.schema = result.errors;
        throw badRequestError;
    }
}
