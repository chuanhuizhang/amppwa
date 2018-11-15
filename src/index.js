const EventEmitter = require('events')

const pkg = require('../package.json')

const Products = require('./products')

const { connectDatabase } = require('./db')

const register = async function (server, options) {

  // Initialize database connection
  const { database } = options
  connectDatabase(database.uri)

  // Initialize event emitter and append it to request instance
  const eventEmitter = new EventEmitter()
  server.decorate('request', 'eventEmitter', eventEmitter)
  server.decorate('server', 'eventEmitter', eventEmitter)

  // Setup routes configurations
  server.route([
    ...Products.routes
  ])
}

module.exports = {
  pkg,
  register
}
