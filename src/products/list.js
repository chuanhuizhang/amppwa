const _ = require('lodash')
const Joi = require('joi')
const Boom = require('boom')
const Config = require('config')

const Product = require('./model')
const Load = require('./load')
const { validateOptions } = require('../utils')

const validate = {
  ...validateOptions,
  query: {
    skip: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().positive().default(25),
    categories: Joi.string(),
    color: Joi.string(),
  }
}

const handler = async (request) => {
  const {
    skip, limit,
    categories, color
  } = request.query
  const query = {}
  if (categories) {
    query['categories'] = { $in: categories.split(',') }
  }
  if (color) {
    query['colors'] = { $elemMatch: { code:  color } }
  }
  
  return await Product.aggregate([
    { $match: query },
    { $skip: skip },
    { $limit: limit }
  ])
}

const response = {
  modify: true,
  schema: (products) => {
    return {
      items: [{
          values: products
      }],
      count: products.length,
      total: 50
    }
  }
}

module.exports = {
  description: 'List products',
  validate,
  handler,
  response
}
