import express from 'express'
import ApiService from '../services/Api-service.js'
import helpObj from '../helpers/functions.helpers.js'
import authUsers from '../helpers/authUsers.js'
import middleware from '../middleware/index.js'

const router = express.Router()

router.get('/', async (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ Message: 'Unauthorized, log in first --' })

  const { name } = req.query
  let { limit } = req.query
  if (!limit) limit = 10

  const token = req.headers.authorization?.split(' ')[1]

  if (token in authUsers) {

    try {

      const { headers } = authUsers[token]
      const ApiCall = new ApiService(headers)

      const isCurrentUser = await middleware.isClientUser(token, ApiCall)

      if (isCurrentUser) return res.status(200).json({ currentUser })

      const clients = await ApiCall.getClients()

      let clientsFiltered

      if (name) clientsFiltered = helpObj.filterClientsByName(clients.data, name)

      clientsFiltered = helpObj.filterByLimit(clientsFiltered || clients.data, limit)

      return res.status(200).json(clientsFiltered)

    } catch (error) {

      if (error.response.data.statusCode === 401) return helpObj.refreshUserToken(token, res, '/clients')

      return res.status(500).json({ message: 'Error finding currentUser', err })

    }

  }
  return res.status(401).json({ Message: 'Unauthorized, log in first' })

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
    return middleware
      .isClientUser(token, ApiCall)
      .then((currentUser) => {
        if (currentUser) return res.status(200).json(currentUser)

        return ApiCall.getClients()
      })
      .then((response) => {
        const client = helpObj.filterById(id, response.data)
        return res.status(200).json(client[0])
      })
      .catch((err) => {
        if (err.response?.data.message === 'Authorization token expired') {
          return helpObj.refreshUserToken(token, res, `/clients/${id}`)
        }
        return res.status(500).json({ message: 'error fetching clients' })
      })
  }
  return res.status(401).json({ Message: 'Unauthorized, log in first' })
})

router.get('/:id/policies', (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ Message: 'Unauthorized, log in first --' })

  const token = req.headers.authorization?.split(' ')[1]

  const { id } = req.params

  if (token in authUsers) {
    // get the headers from the user and call apihandler with this arg
    const { headers } = authUsers[token]
    const ApiCall = new ApiService(headers)

    // if client role is user, return its own user
    return middleware
      .isUserPolicies(token, ApiCall)
      .then((currentUser) => {
        if (currentUser) return res.status(200).json(currentUser)

        return ApiCall.getPolicies()
      })
      .then(({ data }) => {
        // console.log(data)
        const userPolicies = helpObj.filterById(id, data, 'clientId')
        return res.status(200).json(userPolicies)
      })
      .catch((err) => {
        if (err.response?.data.message === 'Authorization token expired') {
          return helpObj.refreshUserToken(token, res, `/clients/${id}`)
        }
        return res.status(500).json({ message: 'error fetching client policies' })
      })
  }
  return res.status(401).json({ Message: 'Unauthorized, log in first' })
})

export default router
