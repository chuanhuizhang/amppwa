const _ = require('lodash')
const Joi = require('joi')
const Boom = require('boom')
const Config = require('config')
const halson = require('halson')

const Product = require('./model')
const { validateOptions } = require('../utils')

const validate = {
  ...validateOptions,
  params: Joi.object({
    pid: Joi.string().required()
  })
}

const handler = async (request) => {
  const { pid } = request.params
  try {
    const product = await Product.findOne({ _id: pid })
    if (!product) {
      return Boom.notFound('Resouce not found.')
    }
    return product
  } catch (err) {
    return Boom.badImplementation(err)
  }
}

module.exports = {
  description: 'Load a product',
  validate,
  handler
}
