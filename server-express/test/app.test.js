import supertest from 'supertest'
import app from '../server.js'

let authToken

describe('POST /login', () => {
  describe('given a username and password', () => {
    test('should respond with a status 200', async () => {
      const response = await supertest(app).post('/login').send({
        username: 'dare',
        password: 's3cr3t',
      })

      // console.log(response.body.data)
      expect(response.statusCode).toBe(200)
    })

    test('should return a token', async () => {
      const response = await supertest(app).post('/login').send({
        username: 'dare',
        password: 's3cr3t',
      })

      // implementar el regex en funcion a parte y hacer el testing de este.
      // 'Bearer\s[\d|a-f]{8}-([\d|a-f]{4}-){3}[\d|a-f]{12}'

      if (response.body.token) {
        authToken = {
          Authorization: `Bearer ${response.body.token}`,
        }
      }

      expect(response.body.token).toBeTruthy()
    })
  })

  describe('POST /login', () => {
    describe('when the username and password are missing', () => {
      test('it should return status 400 missing parameters', async () => {

        const response = await supertest(app).post('/login').send({
          username: 'dare',
        })

        expect(response.statusCode).toBe(400)
      })

      describe('when the username and password are wrong', () => {
        test('it should return status 401 Unauthorized', async () => {
          const response = await supertest(app).post('/login').send({
            username: 'dare',
            password: 'xxx',
          })

          // console.log('--->', response)

          expect(response.statusCode).toBe(401)
        })

      })
    })
  })

})


describe('GET /policies', () => {
  describe('calling this endpoint', () => {
    test('it should return an array of policies objects', async () => {
      const response = await supertest(app).get(`/policies`).send(authToken)

      if (response.body.etag) authToken.etag = response.body.etag

      // console.log('-------->', authToken)

      expect(response.statusCode).toBe(200)
      expect(typeof response.body.policies === 'object').toBeTruthy()
      expect(response.body.policies.length).toBeTruthy()
    })
  })
})

describe('GET /clients', () => {
  describe('calling this endpoint', () => {
    test('it should return an array of clients objects', async () => {
      const response = await supertest(app).get(`/clients`).send(authToken)

      expect(response.statusCode).toBe(200)
      expect(typeof response.body.clients === 'object').toBeTruthy()
      expect(response.body.clients.length).toBeTruthy()
    })
  })
})
