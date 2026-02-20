import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking...')

  useEffect(() => {
    axios.get('/api/health')
      .then(res => setBackendStatus(res.data.message))
      .catch(() => setBackendStatus('Backend not reachable'))
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Portfolio Project</h1>
      <p>Backend status: <strong>{backendStatus}</strong></p>
    </div>
  )
}

export default App
