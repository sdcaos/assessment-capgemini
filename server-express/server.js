import 'dotenv/config'
import express from 'express'
import config from './config/index.js'
// import index from './routes/index.js'
import routes from './routes/index.routes.js'

const app = express()
config(app, express)
routes(app)
// app.use('/', index)


if (process.env.NODE_ENV !== 'test') {
  app.listen(5000, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port http://localhost:5000`)
  })
}

export default app
