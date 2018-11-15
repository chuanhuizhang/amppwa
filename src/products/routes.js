const list = require('./list')
const load = require('./load')

module.exports = [
  {
    path: '/v1.0/products',
    method: 'GET',
    config: list
  },
  {
    path: '/v1.0/products/{pid}',
    method: 'GET',
    config: load
  }
]
