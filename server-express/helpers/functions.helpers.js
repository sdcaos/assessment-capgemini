import findClients from './apiCalls.reusable.js'
import ApiService from '../services/Api-service.js'
import authUsers from './authUsers.js'

const helperFunctions = {

    inputIsMailOrEmail(username) {
        const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/
        const simpleStringRegex = /^[a-zA-Z0-9]*$/

        let nameOrEmail

        if (username.match(simpleStringRegex)) nameOrEmail = 'name'

        if (username.match(emailRegex)) nameOrEmail = 'email'

        return nameOrEmail
    },

    async findCurrentUserDetails(token, ApiCall) {
        const searchKey = inputIsMailOrEmail(authUsers[token].name)
        let currentUser

        const clientsData = await findClients(ApiCall)
            .then((clients) => clients)
            .catch((err) => err)

        if (clientsData) {
            const userName = authUsers[token].name
            currentUser = clientsData.filter((client) => client[searchKey] === userName)
        }
        return currentUser.length ? currentUser[0] : null
    },

    filterClientsByName(clients, name) {
        return clients.filter((client) => client.name.toLowerCase() === name.toLowerCase())
    },

    filterClientsByLimit(clients, limit) {
        const filteredClients = clients.filter(
            function () {
                if (this.count <= limit) {
                    this.count += 1
                    return true
                }
                return false
            },
            { count: 0 },
        )
        return filteredClients
    },

    filterClientsByLimitOrName(clients, limit, name) {
        let clientsFiltered

        if (name) clientsFiltered = filterClientsByName(clients, name)

        console.log(clientsFiltered)

        if (limit) clientsFiltered = filterClientsByLimit(clientsFiltered.length ? clientsFiltered : clients, limit)

        return clientsFiltered
    },

    setUserData(token, name, password, usedCredentials) {
        authUsers[token] = {
            name,
            password,
            usedCredentials,
            headers: { authorization: `Bearer ${token}` },
        }
    },

    async refreshUserToken(token, res) {
        const ApiCall = new ApiService()

        if (token in authUsers) {
            return ApiCall.login(authUsers[token].name, authUsers[token].password)
                .then((response) => {
                    authUsers[token].headers = {
                        Authorization: `Bearer ${response.data.token}`,
                    }

                    return res.header({ Authorization: `Bearer ${token}` }).redirect('/clients')
                })
                .catch((err) => err)
        }

        return { statusCode: 404, message: 'User not found, try to log in' }
    },


    filterClientById() {

    }

}

export default helperFunctions