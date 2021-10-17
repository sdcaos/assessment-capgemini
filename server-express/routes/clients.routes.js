import express from 'express'
import ApiService from '../services/Api-service.js'
import helpObj from '../helpers/functions.helpers.js'
import { findClients } from '../helpers/apiCalls.reusable.js'
import authUsers from '../helpers/authUsers.js'
import middleware from '../middleware/index.js'

const router = express.Router()

router.get('/', (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ Message: 'Unauthorized, log in first --' })

  let { limit, name } = req.query

  if (!limit) limit = 10

  const token = req.headers.authorization?.split(' ')[1]

  // if the token exist in the authUsers object
  if (token in authUsers) {
    // get the headers from the user and call apihandler with this arg
    const { headers } = authUsers[token]
    const ApiCall = new ApiService(headers)

    // if client role is user, return its own user
    middleware
      .isClientUser(token, ApiCall)
      .then((currentUser) => {
        if (currentUser) return res.status(200).json(currentUser)
      })
      .catch((err) => res.status(500).json({ message: 'Error finding currentUser', err }))


    ApiCall.getClients()
      .then((clients) => {
        let clientsFiltered

        if (name) clientsFiltered = helpObj.filterClientsByName(clients.data, name)

        if (limit) clientsFiltered = helpObj.filterByLimit(clientsFiltered || clients.data, limit)

        return res.status(200).json({ clientsFiltered })
      })
      .catch((err) => {
        // if the token expired refresh it
        if (err.response?.data.message === 'Authorization token expired') {
          return helpObj.refreshUserToken(token, res, '/clients')
        }

        res.status(500).json({ message: 'Error fetching clients', err })
      })
  } else {
    res.status(401).json({ Message: 'Unauthorized, log in first' })
  }
})

router.get('/:id', (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ Message: 'Unauthorized, log in first --' })

  const token = req.headers.authorization?.split(' ')[1]

  const { id } = req.params

  if (token in authUsers) {
    // get the headers from the user and call apihandler with this arg
    const { headers } = authUsers[token]
    const ApiCall = new ApiService(headers)

    // if client role is user, return its own user
    middleware
      .isClientUser(token, ApiCall)
      .then((currentUser) => (currentUser ? res.status(200).json(currentUser) : null))
      .catch((err) => res.status(500).json({ message: 'Error finding currentUser', err }))

    ApiCall.getClients()
      .then((response) => {

        const client = helpObj.filterById(id, response.data)
        res.status(200).json(client)
      })
      .catch((err) => {
        if (err.response?.data.message === 'Authorization token expired') {
          return helpObj.refreshUserToken(token, res, `/clients/${id}`)
        }
        res.status(500).json({ message: 'error fetching clients' })
      })
  } else {
    res.status(401).json({ Message: 'Unauthorized, log in first' })
  }
})

export default router
