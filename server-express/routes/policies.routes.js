import express from 'express'
import { ApiService } from '../services/Api-service.js'
import { authUsers } from '../helpers/functions.helpers.js'
const router = express.Router()


router.get('/', (req, res) => {
    const token = req.body
    // console.log(token)
    const ApiCall = new ApiService(token)

    ApiCall.getPolicies()
        .then((response) => {

            authUsers[token.Authorization.split(' ')[1]].etag = response.headers.etag

            return res.status(200).json({
                policies: response.data,
                etag: response.config.headers.etag,
            })
        })

        .catch((error) => res.status(500).json({ error }))
})


export default router
