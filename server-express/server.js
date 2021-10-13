import 'dotenv/config'

import express from 'express'

import logger from 'morgan'
import cookieParser from 'cookie-parser'
import config from './config/index.js'

import index from './routes/index.js'

import errorHandling from './error-handling/index.js'

const app = express()
config(app, express, logger, cookieParser)

app.use('/', index)
errorHandling(app)

if (process.env.NODE_ENV !== 'test') {
  app.listen(5000, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port http://localhost:5000`)
  })
}
// require('./error-handling')(app)

export default app