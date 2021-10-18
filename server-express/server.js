import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import logger from 'morgan'
import config from './config/index.js'
// import index from './routes/index.js'
import errorHandling from './error-handling/index.js'
import routes from './routes/index.routes.js'

const app = express()
config(app, express, logger)

app.use(cors())

routes(app)
// app.use('/', index)

errorHandling(app)

if (process.env.NODE_ENV !== 'test') {
  app.listen(5000, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port http://localhost:5000`)
  })
}

export default app
