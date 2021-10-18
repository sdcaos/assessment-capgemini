import supertest from 'supertest'
import helpObj from '../helpers/functions.helpers.js'
import app from '../server.js'

describe('integration test suit', () => {
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

            expect(response.statusCode).toBe(401)
          })
        })
      })
    })
  })
})

describe('unit test', () => {
  describe('passing an array and a limit to filterByLimit function', () => {
    test('it should return a maxlength of limit', () => {
      const testArray = [2, 323, 412, 1421, 1241, 12, 1, 21, 331, 23, 131, 321, 31, 312, 31]

      const limit = 5

      expect(helpObj.filterByLimit(testArray, limit).length <= limit).toBeTruthy()
    })
  })
})
