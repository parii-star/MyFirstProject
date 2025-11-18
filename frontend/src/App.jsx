import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/connect')
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => console.error(err))

    fetchItems()
  }, [])

  const fetchItems = () => {
    fetch('http://localhost:5000/items')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('http://localhost:5000/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    })
      .then(() => {
        setName('')
        setDescription('')
        fetchItems()
      })
      .catch(err => console.error(err))
  }

  return (
    <div className="App">
      <h1>Three Tier App</h1>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Add Item</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App