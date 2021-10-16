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

  return (
    <div className="App">
      <button type="button" onClick={login}>
        log in
      </button>
      <button type="button" onClick={clients}>
        clients
      </button>
    </div>
  )
}

export default App
