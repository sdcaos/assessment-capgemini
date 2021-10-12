import axios from 'axios'

class ApiService {
  constructor() {
    this.app = axios.create({
      baseURL: 'https://dare-nodejs-assessment.herokuapp.com/',
    })
  }
}

export default ApiService
