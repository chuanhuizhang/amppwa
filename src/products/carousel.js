const _ = require('lodash')
const Joi = require('joi')
const Boom = require('boom')
const Config = require('config')

const IMAGE_LIST = [{
  name: 'Slide 1',
  img: 'https://s7d2.scene7.com/is/image/Newellsync/alex-morgan-tpt-bp2t?hei=680&qlt=85%2C0&wid=2048'
}, {
  name: 'Slide 2',
  img: 'https://s7d2.scene7.com/is/image/Newellsync/sharpie-tpt-bp2t?hei=680&qlt=85%2C0&wid=2048'
}]

const handler = () => {
  return IMAGE_LIST
}

const response = {
  modify: true,
  schema: (products) => {
    return {
      items: [{
          values: products
      }]
    }
  }
}

module.exports = {
  description: 'List carousel images',
  handler,
  response
}
