import express from 'express'
import ApiHandler from '../services/Api-service.js'

// import axios from 'axios'

const router = express.Router()
let authorizationHeader = {}

router.post('/login', (req, res) => {
  const ApiCall = new ApiHandler()
  const { username, password } = req.body

  ApiCall.login(username, password)
    .then((response) => {
      authorizationHeader = {
        Authorization: `${response.data.type} ${response.data.token}`,
      }

      return res.status(200).json({ token: response.data })
    })
    .catch((error) => res.status(500).json({ error }))
})

router.get('/policies', (req, res) => {
  const token = req.body

  const ApiCall = new ApiHandler(token)

  ApiCall.getPolicies()
    .then((response) => {
      authorizationHeader.etag = response.headers.etag

      return res.status(200).json({
        policies: response.data,
        etag: response.config.headers.etag,
      })
    })

    .catch((error) => res.status(500).json({ error }))
})

router.get('/clients', (req, res) => {
  const token = req.body

  const ApiCall = new ApiHandler(token)

  ApiCall.getPolicies()
    .then((response) => {
      authorizationHeader.etag = response.headers.etag

      return res.status(200).json({
        clients: response.data,
        etag: response.config.headers.etag,
      })
    })

    .catch((error) => res.status(500).json({ error }))
})

export default router
