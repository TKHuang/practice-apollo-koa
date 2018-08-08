const dotenv = require('dotenv-safe')

if (process.env.NODE_ENV === 'dev') {
  dotenv.config({ path: '.env.dev', allowEmptyValues: true })
} else if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test', allowEmptyValues: true })
} else if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env' })
}

require('babel-core/register')({ presets: ['env'] })
require('babel-polyfill')
require('./src/app.js')
