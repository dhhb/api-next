import fortune from 'fortune';
import validateSchema from 'is-my-schema-valid';

const BadRequestError = fortune.errors.BadRequestError;

export default function validate (record, schema, options) {
    const result = validateSchema(record, schema, options);
    if (!result.valid) {
        const badRequestError = new BadRequestError('Error validating against schema');
        badRequestError.schema = result.errors;
        throw badRequestError;
    }
}
