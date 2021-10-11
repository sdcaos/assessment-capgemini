const router = require('express').Router()
const ApiHandler = require('../services/Api-service')

const ApiCall = new ApiHandler()

/* GET home page */
router.post('/login', (req, res) => {
  const { user, password } = req.body

  ApiCall.login(user, password)
    .then((response) => res.status(200).json({ response }))
    .catch((err) => res.status(500).json({ message: err }))
})

module.exports = router
