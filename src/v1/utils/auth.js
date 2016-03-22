import fortune from 'fortune';
import config from 'c0nfig';

const BadRequestError = fortune.errors.BadRequestError;
const UnauthorizedError = fortune.errors.UnauthorizedError;

export function validateSharedKey (context) {
    const query = context.request.uriObject.query || {};
    const sharedKey = query.shared_key;
    if (!sharedKey) {
        throw new BadRequestError('Shared key is missing');
    }

    if (sharedKey !== config.auth.sharedKey) {
        throw new UnauthorizedError('Shared key is incorrect');
    }
}

export async function validateToken (context) {
    const headers = context.request.meta.headers;
    const query = context.request.uriObject.query || {};
    const tokenId = headers.authorization || query.token;

    if (!tokenId) {
        throw new BadRequestError('Token is missing');
    }

    const token = await context.transaction.find('token', [tokenId]);
    if (!token.count) {
        throw new UnauthorizedError('Token is incorrect');
    }

    return token[0];
}
