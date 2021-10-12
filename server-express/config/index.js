const config = (app, express, logger, cookieParser) => {
  app.use(logger('dev'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
}

export default config
