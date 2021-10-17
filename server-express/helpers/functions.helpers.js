import { findClients, findPolicies } from './apiCalls.reusable.js'
import ApiService from '../services/Api-service.js'
import authUsers from './authUsers.js'

const helpObj = {
  inputIsMailOrEmail: (username) => {
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/
    const simpleStringRegex = /^[a-zA-Z0-9]*$/

    let nameOrEmail

    if (username.match(simpleStringRegex)) nameOrEmail = 'name'

    if (username.match(emailRegex)) nameOrEmail = 'email'

    return nameOrEmail
  },

  findCurrentUserDetails: async (token, ApiCall) => {
    const searchKey = helpObj.inputIsMailOrEmail(authUsers[token].name)
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

  filterClientsByName: (clients, name) => {
    return clients.filter((client) => client.name.toLowerCase() === name.toLowerCase())
  },

  filterByLimit: (array, limit) => {
    const filteredClients = array.filter(
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

  filterClientsByLimitOrName: (clients, limit, name) => {
    let clientsFiltered

    if (name) clientsFiltered = helpObj.filterClientsByName(clients, name)

    if (limit) clientsFiltered = helpObj.filterByLimit(clientsFiltered.length ? clientsFiltered : clients, limit)

    return clientsFiltered
  },

  setUserData: (token, name, password, usedCredentials) => {
    authUsers[token] = {
      name,
      password,
      usedCredentials,
      headers: { authorization: `Bearer ${token}` },
    }
  },

  refreshUserToken: async (token, res, redirect) => {
    const ApiCall = new ApiService()

    if (token in authUsers) {
      return ApiCall.login(authUsers[token].name, authUsers[token].password)
        .then((response) => {
          authUsers[token].headers = {
            Authorization: `Bearer ${response.data.token}`,
          }

          return res.header({ Authorization: `Bearer ${token}` }).redirect(redirect)
        })
        .catch((err) => err)
    }

    return { statusCode: 404, message: 'User not found, try to log in' }
  },

  filterById: (id, array) => {
    return array.filter((elm) => elm.id === id)[0]
  },

  findUserPolicies: async (currentUser, ApiCall, limit) => {
    const policies = await findPolicies(ApiCall)

    const userPolicies = policies.filter((policy) => policy.clientId === currentUser.id)

    if (limit) helpObj.filterByLimit(userPolicies, limit)

    return userPolicies
  },
}

export default helpObj
