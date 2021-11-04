import cors from 'cors'
import logger from 'morgan'

const config = (app, express) => {
  app.use(logger('dev'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cors())
}

export default config
