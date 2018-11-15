const SERVER_PORT = 3000
const SERVER_ORIGIN = 'https://localhost'

module.exports = {
  server: {
    origin: process.env.ORIGIN || SERVER_ORIGIN,
    port: process.env.PORT || SERVER_PORT
  }
}
