import express from 'express'
import ApiHandler from '../services/Api-service.js'

const router = express.Router()
const ApiCall = new ApiHandler()

/* GET home page */
router.post('/login', (req, res) => {
  res.sendStatus(200)

  // const { user, password } = req.body

  // ApiCall.login(user, password)
  //   .then((response) => res.status(200).json({ response }))
  //   .catch((err) => res.status(500).json({ message: err }))
})

export default router
