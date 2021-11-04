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

  const token = helpObj.substractToken(req)

  if (!token in authUsers) return res.status(401).json({ Message: 'Unauthorized, log in first' })

  try {

    const { headers } = authUsers[token]

    const isCurrentUser = await middleware.isClientUser(token, ApiService)

    console.log(isCurrentUser)

    if (isCurrentUser) return res.status(200).json({ isCurrentUser })

    const clients = await ApiService.getClients(headers)

    console.log(clients)

    let clientsFiltered

    if (name) clientsFiltered = helpObj.filterClientsByName(clients.data, name)

    clientsFiltered = helpObj.filterByLimit(clientsFiltered || clients.data, limit)

    return res.status(200).json(clientsFiltered)

  } catch (error) {

    if (error.response?.data.statusCode === 401) return helpObj.refreshUserToken(token, res, '/clients')

    return res.status(500).json({ message: 'Error finding currentUser', error })

  }
})

router.get('/:id', async (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ Message: 'Unauthorized, log in first --' })

  const token = helpObj.substractToken(req)

  const { id } = req.params

  if (!token in authUsers) return res.status(401).json({ Message: 'Unauthorized, log in first' })

  try {
    // get the headers from the user and call apihandler with this arg
    const { headers } = authUsers[token]

    // if client role is user, return its own user
    const clientUserData = await middleware.isClientUser(token, ApiService, headers)

    if (clientUserData) return res.status(200).json(currentUser)

    const { data: clientsListData } = await ApiService.getClients(headers)

    const client = helpObj.filterById(id, clientsListData)

    return res.status(200).json(client[0])

  } catch (error) {

    if (error.response?.data.statusCode === 401) {

      return helpObj.refreshUserToken(token, res, `/clients/${id}`)
    }
    return res.status(500).json({ message: 'error fetching clients' })

  }

})


router.get('/:id/policies', (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ Message: 'Unauthorized, log in first --' })

  const token = req.headers.authorization?.split(' ')[1]

  const { id } = req.params

  if (token in authUsers) {
    // get the headers from the user and call apihandler with this arg
    const { headers } = authUsers[token]
    // const ApiCall = new ApiService(headers)

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
