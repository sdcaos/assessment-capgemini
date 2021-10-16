import express from 'express'
import { ApiService } from '../services/Api-service.js'
import { authUsers, findCurrentUserDetails, filterClientsByLimitOrName } from '../helpers/functions.helpers.js'
import { findClients } from '../helpers/apiCalls.reusable.js'
const router = express.Router()

router.get('/', async (req, res) => {

    const ApiCall = new ApiService(req.headers)
    const { limit, name } = req.query

    if (!req.headers.authorization) return res.status(401).json({ Message: 'Unauthorized, log in first' })

    // if the user exist in the authUsers object
    if (req.headers.authorization.split(' ')[1] in authUsers) {

        const token = req.headers.authorization?.split(' ')[1]

        const currentUser = await findCurrentUserDetails(token, ApiCall)
            .then(currentUser => currentUser)
            .catch(err => err)

        // if the user role is simple user return just hes own userdata
        if (currentUser?.role === 'user') return res.status(200).json(currentUser)

        findClients(ApiCall)
            .then(response => {

                if (limit || name) {

                    const clientResults = filterClientsByLimitOrName(clients, 10, 'Perry')

                    console.log(clientResults)

                }
                res.status(200).json({ response })
            })
            .catch(err => res.status(500).json({ message: 'Error fetching clients', err }))
    } else {
        res.status(401).json({ Message: 'Unauthorized, log in first' })
    }

})






export default router
