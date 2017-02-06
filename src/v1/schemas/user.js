export const create = {
  email: {
    type: 'string',
    format: 'email',
    required: true
  },
  password: {
    type: 'string',
    required: true,
    minLength: 6
  },
  name: {
    type: 'string',
    required: true,
    minLength: 1
  },
  roles: {
    type: 'array',
    items: {
      enum: ['writer', 'admin']
    },
    required: true
  }
};

export const update = {
  name: {
    type: 'string'
  },
  pictureData: {
    type: 'string',
    format: 'data-uri'
  }
};
