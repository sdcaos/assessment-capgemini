import express from 'express'
import ApiService from '../services/Api-service.js'
import helpObj from '../helpers/functions.helpers.js'
const router = express.Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) return res.status(400).json({ message: 'Missing parameters' })

  try {

    const response = await ApiService.login(username, password)

    helpObj.setUserData(response.data.token, username, password, helpObj.inputIsNameOrEmail(username))

    response.data.expires_in = 900000

    return res.status(200).json(response.data)

  } catch (error) {

    return error.response?.data.statusCode === 401
      ?
      res.status(401).json({ message: error.response.data.message })
      :
      res.status(500).json({ error })

  }

})

export default router
