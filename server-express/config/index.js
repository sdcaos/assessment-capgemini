const config = (app, express, logger) => {
  app.use(logger('dev'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
}

export default config
