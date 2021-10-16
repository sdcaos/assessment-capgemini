import axios from 'axios'

class ApiService {
  constructor(authToken) {
    this.baseUrl = { baseURL: 'http://localhost:5000' }

    if (authToken) this.baseUrl.headers = { Authorization: `${authToken.type} ${authToken.token}` }

    this.app = axios.create(this.baseUrl)
  }

  login = (username, password) =>
    this.app.post('/login', {
      username,
      password,
    })

  getClients = () => this.app.get(`/clients`)

  getPolicies = () => this.app.get('/policies')
}

export default ApiService
