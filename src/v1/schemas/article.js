const base = {
  title: {
    type: ['string', 'null']
  },
  intro: {
    type: ['string', 'null']
  },
  content: {
    type: ['string', 'null']
  },
  category: {
    type: 'string',
    format: 'mongo-object-id'
  },
  keywords: {
    type: 'array',
    items: {
      type: 'string'
    },
    uniqueItems: true
  }
};

export const create = {
  ...base
};

export const update = {
  ...base,
  publish: {
    type: 'boolean'
  },
  coverData: {
    type: ['string', 'null'],
    format: 'data-uri'
  }
};
