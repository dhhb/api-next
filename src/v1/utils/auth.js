import fortune from 'fortune';
import config from 'c0nfig';
import store from '../store';

const BadRequestError = fortune.errors.BadRequestError;
const UnauthorizedError = fortune.errors.UnauthorizedError;

export function validateSharedKey(context) {
  const query = context.request.uriObject.query || {};
  const sharedKey = query.shared_key;

  if (!sharedKey) {
    throw new BadRequestError('Shared key is missing');
  }

  if (sharedKey !== config.auth.sharedKey) {
    throw new UnauthorizedError('Shared key is incorrect');
  }
}

export async function validateToken(context, skipUser) {
  const headers = context.request.meta.headers;
  const query = context.request.uriObject.query || {};
  const tokenId = headers.authorization || query.token;

  if (!tokenId) {
    throw new BadRequestError('Token is missing');
  }

  const tokens = await store.adapter.find('token', [tokenId], {
    fields: {
      userId: true
    }
  });

  if (!tokens.count) {
    throw new UnauthorizedError('Token is expired or incorrect');
  }

  const [token] = tokens;

  if (skipUser) {
    return token;
  }

  const users = await store.adapter.find('user', [token.userId], {
    fields: {
      email: true,
      roles: true
    }
  });

  if (!users.count) {
    throw new UnauthorizedError('There are no user with this token');
  }

  const [user] = users;

  return user;
}
