import express from 'express'
import ApiService from '../services/Api-service.js'
import authUsers from '../helpers/authUsers.js'
import middleware from '../middleware/index.js'
import helpObj from '../helpers/functions.helpers.js'

const router = express.Router()

router.get('/', (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ Message: 'Unauthorized, log in first --' })

  let { limit } = req.query
  if (!limit) limit = 10
  const token = req.headers.authorization?.split(' ')[1]

  if (token in authUsers) {
    const { headers } = authUsers[token]
    const ApiCall = new ApiService(headers)

    return ApiCall.getPolicies()
      .then(async (response) => {
        const currentUserPolicies = await middleware.isUserPolicies(token, ApiCall)

        if (currentUserPolicies.length) return res.status(200).json({ currentUserPolicies })

        if (limit) response.data = helpObj.filterByLimit(response.data, limit)

        return res.status(200).json(response.data)
      })

      .catch((error) => {
        if (error.response?.data.message === 'Authorization token expired') {
          return helpObj.refreshUserToken(token, res, '/policies')
        }

        return res.status(500).json({ error })
      })
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
    return ApiCall.getPolicies()
      .then(async (response) => {
        const currentUserPolicies = await middleware.isUserPolicies(token, ApiCall)

        if (currentUserPolicies.length) {
          const policy = helpObj.filterById(id, currentUserPolicies)
          return res.status(200).json({ policy: policy[0] })
        }

        const policy = helpObj.filterById(id, response.data)

        return !policy.length
          ? res.status(404).json({ message: 'user not found' })
          : res.status(200).json({ policy: policy[0] })
      })

      .catch((error) => {
        // refresh token
        if (error.response?.data.message === 'Authorization token expired') {
          return helpObj.refreshUserToken(token, res, `/policies/${id}`)
        }
        return res.status(500).json({ error })
      })
  }
  return res.status(401).json({ Message: 'Unauthorized, log in first' })
})

export default router
