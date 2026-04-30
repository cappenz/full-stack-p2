import { useEffect, useState } from 'react'
import axios from 'axios' // Make sure you've run: npm install axios
import './App.css'


// ============================================
// MAIN APP
// ============================================
function App() {
  const [greeting, setGreeting] = useState("Loading...")

  useEffect(() => {
    axios.get('http://localhost:5000/api/hello')
      .then(res => setGreeting(res.data.message))
      .catch(err => {
        console.error("Error fetching data:", err)
        setGreeting("Server is not responding")
      })
  }, [])

  return (
    <>
      <Looks />
    </>
  )
}

// ============================================
// looks
// ============================================

function Looks() {
  return <div className="heading_bar"  />
  //<p>name</p>
}

export default App
