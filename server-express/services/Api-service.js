import axios from 'axios'





export class ApiService {
  constructor(headers) {
    this.baseUrl = { baseURL: 'https://dare-nodejs-assessment.herokuapp.com/api' }

    // console.log('headers----->', headers)

    if (headers?.authorization) this.baseUrl.headers = { authorization: `${headers?.authorization.split(' ')[0]} ${headers.authorization?.split(' ')[1]}` }

    this.app = axios.create(this.baseUrl)
  }



  login = (username, password) => this.app.post('/login', {
    client_id: username,
    client_secret: password,
  })

  getClients = () => this.app.get(`/clients`)

  getPolicies = () => this.app.get('/policies')
}


