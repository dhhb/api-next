import isBase64 from 'validator/lib/isBase64';
import { generate, validate } from '../../src/v1/utils/token';

describe('token util', () => {
    let token;
    let userData;

    describe('when generating token', () => {
        before(() => {
            token = generate({foo: 'bar'});
        });

        it('should return access base64 encoded token string', () => {
            expect(token).to.be.a('string');
            expect(isBase64(token)).to.equal(true);
        });

        describe('when validating token', () => {
            before(() => {
                userData = validate(token);
            });

            it('should return user data for this token', () => {
                expect(userData).to.be.an('object');
                expect(userData.foo).to.equal('bar');
            });
        });
    });
});
