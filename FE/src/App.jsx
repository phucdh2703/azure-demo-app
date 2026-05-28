import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default function App() {
  const [employees, setEmployees] = useState([])
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')

  useEffect(() => { fetchList(); }, [])

  async function fetchList() {
    try {
      const { data } = await axios.get(`${API}/employees`)
      setEmployees(data)
    } catch (err) {
      console.error(err)
    }
  }

  async function addEmployee(e) {
    e.preventDefault()
    if (!name) return
    try {
      await axios.post(`${API}/employees`, { name, position })
      setName('')
      setPosition('')
      fetchList()
    } catch (err) { console.error(err) }
  }

  return (
    <div style={{padding:20, fontFamily:'Arial, sans-serif'}}>
      <h1>Employee Dashboard</h1>
      <form onSubmit={addEmployee} style={{marginBottom:20}}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Position" value={position} onChange={e=>setPosition(e.target.value)} style={{marginLeft:8}} />
        <button style={{marginLeft:8}} type="submit">Add</button>
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Position</th><th>Created</th></tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}><td>{emp.id}</td><td>{emp.name}</td><td>{emp.position}</td><td>{new Date(emp.created_at).toLocaleString()}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
