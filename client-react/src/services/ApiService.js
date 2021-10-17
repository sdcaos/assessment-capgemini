import axios from 'axios'

class ApiService {
  constructor(authToken) {
    this.baseUrl = { baseURL: 'http://localhost:5000' }

    if (authToken) this.baseUrl.headers = { Authorization: `${authToken.type} ${authToken.token}` }

    // const oldToken =
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6ImRhcmUiLCJpYXQiOjE2MzQ0MjUyMDgsImV4cCI6MTYzNDQyNTgwOH0.knDKQ77rOVql7FHK22NS_gwSwieMV_4Zc2lqmH9Zxlg'
    // this.baseUrl.headers = { Authorization: `Bearer ${oldToken}` }

    this.app = axios.create(this.baseUrl)
  }

  login = (username, password) =>
    this.app.post('/login', {
      username,
      password,
    })

  getClients = () => this.app.get(`/clients`)

  getClientsId = () => this.app.get(`/clients/a0ece5db-cd14-4f21-812f-966633e7be86`)

  getPolicies = () => this.app.get('/policies')
}

export default ApiService
