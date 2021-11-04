import axios from 'axios'

class ApiHandler {
  constructor(userHeaders) {
    this.baseUrl = { baseURL: 'https://dare-nodejs-assessment.herokuapp.com/api' }

    // console.log('headers----->', headers)

    if (userHeaders) this.baseUrl.headers = userHeaders

    this.app = axios.create(this.baseUrl)
  }

  login = (username, password,) =>
    this.app.post('/login', {
      client_id: username,
      client_secret: password,
    })

  getClients = (headers) => this.app.get(`/clients`, { headers })

  getPolicies = (headers) => this.app.get('/policies', { headers })
}

const ApiService = new ApiHandler()
export default ApiService
