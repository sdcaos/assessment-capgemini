import authRoutes from './auth.routes.js'
import clientRoutes from './clients.routes.js'
import policiesRoutes from './policies.routes.js'

const routes = (app) => {
  app.use('/', authRoutes)
  app.use('/clients', clientRoutes)
  app.use('/policies', policiesRoutes)
}

export default routes
