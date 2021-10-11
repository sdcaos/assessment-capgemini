const axios = require('axios')

class ApiService {
  constructor() {
    this.app = axios.create({
      baseURL: 'https://dare-nodejs-assessment.herokuapp.com/',
    })
  }
}

module.exports = ApiService
