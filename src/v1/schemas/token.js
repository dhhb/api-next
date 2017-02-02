export const create = {
  email: {
    type: 'string',
    format: 'email',
    required: true
  },
  password: {
    type: ['string', 'number'], // temp workaround, we need to pass plain res.body to schema validator
    required: true
  }
};
