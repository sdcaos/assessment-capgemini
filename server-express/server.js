import 'dotenv/config'

import express from 'express'
const app = express()

import logger from 'morgan'
import cookieParser from 'cookie-parser'
import config from './config/index.js'
config(app, express, logger, cookieParser)

import index from './routes/index.js'

app.use('/', index)

import errorHandling from './error-handling/index.js'
errorHandling(app)

app.listen(5000, () => {
  console.log(`Server listening on port http://localhost:5000`)
})
// require('./error-handling')(app)

export default app
