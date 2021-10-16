import express from 'express'
import { ApiService } from '../services/Api-service.js'
import { inputIsMailOrEmail, setUserData } from '../helpers/functions.helpers.js'
const router = express.Router()




router.post('/login', (req, res) => {
    const ApiCall = new ApiService()
    const { username, password } = req.body

    if (!username || !password) return res.status(400).json({ message: 'Missing parameters' })

    ApiCall.login(username, password)
        .then((response) => {
            setUserData(response.data.token, username, password, inputIsMailOrEmail(username))

            // console.log(authUsers)

            response.data.expires_in = 60000

            return res.status(200).json(response.data)
        })
        .catch((error) => {

            if (error.response?.data.message === 'invalid secret or client id') {
                return res.status(401).json({ message: error.response.data.message })
            }

            return res.status(500).json({ error })
        })
})

export default router
