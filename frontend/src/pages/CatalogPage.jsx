import { useState, useEffect } from 'react'
import api from '../api'

function CatalogPage() {
  const [status, setStatus] = useState('Checking connection...')

  useEffect(() => {
    api.get('/health')
      .then(response => {
        setStatus(response.data)
      })
      .catch(() => {
        setStatus('Connection failed — is the backend running?')
      })
  }, [])

  return (
    <div>
      <h1>Catalog Page</h1>
      <p>Backend status: {status}</p>
    </div>
  )
}

export default CatalogPage