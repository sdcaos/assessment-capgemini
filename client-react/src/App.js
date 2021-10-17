import './App.css'
import { useState } from 'react'
import ApiService from './services/ApiService'

function App() {
  const [token, setToken] = useState()

  const login = () => {
    const Api = new ApiService()

    Api.login('dare', 's3cr3t')
      .then((response) => setToken(response.data))
      .catch((err) => console.log(err))
  }
  const clients = () => {
    const Api = new ApiService(token)
    Api.getClients()
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err))
  }
  const clientsId = () => {
    const Api = new ApiService(token)
    Api.getClientsId()
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err))
  }
  const policies = () => {
    const Api = new ApiService(token)
    Api.getPolicies()
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err))
  }
  const policiesId = () => {
    const Api = new ApiService(token)
    Api.getPoliciesId()
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err))
  }

  return (
    <div className="App">
      <button type="button" onClick={login}>
        log in
      </button>
      <button type="button" onClick={clients}>
        clients
      </button>
      <button type="button" onClick={clientsId}>
        clients Per Id
      </button>
      <button type="button" onClick={policies}>
        Policies
      </button>
      <button type="button" onClick={policiesId}>
        Policies PER ID
      </button>
    </div>
  )
}

export default App
