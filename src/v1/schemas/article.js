export const create = {
  title: {
    type: 'string',
    default: ''
  },
  intro: {
    type: 'string',
    default: ''
  },
  content: {
    type: 'string',
    default: ''
  },
  keywords: {
    type: 'array',
    items: {
      type: 'string'
    },
    uniqueItems: true,
    default: []
  }
};

export const update = {
  title: {
    type: 'string'
  },
  intro: {
    type: 'string'
  },
  content: {
    type: 'string'
  },
  keywords: {
    type: 'array',
    items: {
      type: 'string'
    },
    uniqueItems: true
  },
  publish: {
    type: 'boolean'
  },
  coverData: {
    type: ['string', 'null'],
    format: 'data-uri'
  }
};
