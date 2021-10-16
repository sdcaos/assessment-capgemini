import { findClients } from "./apiCalls.reusable.js"

export let authUsers = {}

export const inputIsMailOrEmail = (username) => {
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/

    if (username.match(/^[a-zA-Z0-9]*$/)) return 'name'

    if (username.match(emailRegex)) return 'email'
}

export const findCurrentUserDetails = async (token, ApiService) => {

    const searchKey = inputIsMailOrEmail(authUsers[token].name)

    const clients = await findClients(ApiService)
        .then(clients => clients)
        .catch(err => err)

    if (clients) {

        const userName = authUsers[token].name
        const currentUser = clients.filter(client => client[searchKey] === userName)

        return currentUser.length ? currentUser[0] : null

    }
}

const filterClientsByName = (clients, name) => {

    return clients.filter(client => client.name === name)

}


const filterClientsByLimit = (clients, limit) => {

    return clients.filter(function () {

        if (this.count <= limit) {
            this.count += 1
            return true
        }

    }, { count: 0 })

}


export const filterClientsByLimitOrName = (clients, limit, name) => {

    let clientsFiltered

    if (name) clientsFiltered = filterClientsByName(clients, name)

    if (limit) clientsFiltered = filterClientsByLimit(clients, limit)

    return clientsFiltered

}



export const setUserData = (token, name, password, identifier) => {

    authUsers[token] = {
        name: name,
        password: password,
        identifier
    }

}
