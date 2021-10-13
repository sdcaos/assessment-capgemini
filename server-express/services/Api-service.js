import axios from 'axios'

class ApiService {
  constructor(headerAuthData) {
    const baseUrl = { baseURL: 'https://dare-nodejs-assessment.herokuapp.com/api' }

    if (headerAuthData) baseUrl.headers = headerAuthData

    this.app = axios.create(baseUrl)
  }

  login = (username, password) =>
    this.app.post('/login', {
      client_id: username,
      client_secret: password,
    })

  getPolicies = () => this.app.get('/policies')

  getClients = () => this.app.get(`/clients`)
}

export default ApiService
