import express from 'express'
import ApiService from '../services/Api-service.js'
import helpObj from '../helpers/functions.helpers.js'
import findClients from '../helpers/apiCalls.reusable.js'
import authUsers from '../helpers/authUsers.js'

const router = express.Router()

router.get('/', async (req, res) => {

    if (!req.headers.authorization) return res.status(401).json({ Message: 'Unauthorized, log in first --' })

    const { limit, name } = req.query
    const token = req.headers.authorization?.split(' ')[1]

    // if the token exist in the authUsers object
    if (token in authUsers) {
        // get the headers from the user and call apihandler with this arg
        const { headers } = authUsers[token]
        const ApiCall = new ApiService(headers)

        const currentUser = await helpObj.findCurrentUserDetails(token, ApiCall)
            .then((currentUser) => currentUser)
            .catch((err) => err)

        // if the user role is simple user return just hes own userdata
        if (currentUser?.role === 'user') return res.status(200).json(currentUser)

        findClients(ApiCall)
            .then((clients) => {
                // if the token expired refresh it
                if (clients.response?.data.message === 'Authorization token expired') {
                    return helpObj.refreshUserToken(token, res)
                }

                if (limit || name) clients = filterClientsByLimitOrName(clients, limit, name)

                res.status(200).json({ clients })
            })
            .catch((err) => {
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

        findClients(ApiCall)
            .then(response => filterClientById(id, response))
            .catch(err => console.log(err))

    } else {
        res.status(401).json({ Message: 'Unauthorized, log in first' })
    }

})

export default router
