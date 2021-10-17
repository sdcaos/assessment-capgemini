import axios from 'axios'

class ApiService {
  constructor(userHeaders) {
    this.baseUrl = { baseURL: 'https://dare-nodejs-assessment.herokuapp.com/api' }

    // console.log('headers----->', headers)

    if (userHeaders) this.baseUrl.headers = userHeaders

    this.app = axios.create(this.baseUrl)
  }

  login = (username, password) =>
    this.app.post('/login', {
      client_id: username,
      client_secret: password,
    })

  getClients = () => this.app.get(`/clients`)

  getPolicies = () => this.app.get('/policies')
}

export default ApiService
