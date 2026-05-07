import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import './App.css'

//setting strucutre 
function createDefaultNote(number) {
  return {
    number,
    name: 'name',
    title: 'title',
    date: 'd/m/y',
    entry: 'lorem ipsum ',
  }
}


// ============================================
// MAIN APP
// Handles global note state + top-level data flow
//  some of this is from the OG code
// ============================================
function App() {
  const [, setGreeting] = useState('Loading...')
  const [entryNumber, setEntryNumber] = useState(1)
  const [note, setNote] = useState(createDefaultNote(1))

  // Keep a quick server heartbeat so startup issues are obvious.
  useEffect(() => {
    async function loadGreeting() {
      try {
        const res = await axios.get('http://localhost:5000/api/hello')
        setGreeting(res.data.message)
      } catch (err) {
        console.error('Error fetching data:', err)
        setGreeting('Server is not responding')
      }
    }

    loadGreeting()
  }, [])

  // Always mirror the active entry number in the note object.
  useEffect(() => {
    setNote((prev) => ({ ...prev, number: entryNumber }))
  }, [entryNumber])

  return (
    <>
      <Header note={note} setNote={setNote} />
      <Notebook note={note} setNote={setNote} />
      <Buttons
        note={note}
        setNote={setNote}
        entryNumber={entryNumber}
        setEntryNumber={setEntryNumber}
      />
    </>
  )
}

// ============================================
// Visuals
// getting the visuals
// ============================================
function Header({ note, setNote }) {
  const updateField = (field) => (e) => {
    setNote((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div className="heading_bar">
      <div className="name_container">
        <textarea
          id="name_container"
          rows="1"
          cols="10"
          value={note.name}
          onChange={updateField('name')}
        />
      </div>
      <div className="title_container">
        <textarea
          id="title_container"
          rows="1"
          cols="15"
          value={note.title}
          onChange={updateField('title')}
        />
      </div>
      <div className="date_container">
        <textarea
          id="date_container"
          rows="1"
          cols="5"
          value={note.date}
          onChange={updateField('date')}
        />
      </div>
    </div>
  )
}

// ============================================
// NOTEBOOK
// Main writing area for the current entry body
// ============================================
function Notebook({ note, setNote }) {
  return (
    <div className="note_book">
      <div className="entry_container">
        <textarea
          id="entry_container"
          rows="35"
          cols="120"
          value={note.entry}
          onChange={(e) => setNote((prev) => ({ ...prev, entry: e.target.value }))}
        />
      </div>
    </div>
  )
}

// ============================================
// BUTTON CONTROLS
// Save/create/load/navigation actions for entries
// ============================================
function Buttons({ note, setNote, entryNumber, setEntryNumber }) {
  const apiBaseUrl = 'http://localhost:5000/api/entries'
  const latestLoadRequestId = useRef(0)
  const buttons = [
    // dictionary for the dif buttons
    { id: 'back', label: 'Back', location: 'left' },
    { id: 'save', label: 'Save', location: 'center-left' },
    { id: 'forward', label: 'Forward', location: 'right' },
    { id: 'new', label: 'New', location: 'center-right' },
  ]


  //this section came from alot of dif google sources 
  // Save current in-memory note to the API.
  async function saveButton() {
    try {
      const payload = { ...note, number: entryNumber }
      const response = await axios.post(apiBaseUrl, payload)
      console.log('Entry saved:', response.data)
    } catch (err) {
      console.error('Failed to save entry:', err.response?.data || err.message)
    }
  }

  // Advance to a clean entry template.
  function newButton() {
    setEntryNumber((prevNumber) => {
      const nextNumber = prevNumber + 1
      setNote(createDefaultNote(nextNumber))
      return nextNumber
    })
  }

  // Single source of truth for loading entries by number.
  async function loadEntryByNumber(targetNumber) {
    // Ignore stale responses if users click quickly.
    const requestId = latestLoadRequestId.current + 1
    latestLoadRequestId.current = requestId
    setEntryNumber(targetNumber)

    try {
      const response = await axios.get(`${apiBaseUrl}/${targetNumber}`)
      if (requestId !== latestLoadRequestId.current) {
        return
      }

      if (response.data.entry) {
        setNote(response.data.entry)
      } else {
        setNote(createDefaultNote(targetNumber))
      }
    } catch (err) {
      console.error('Failed to load entry:', err.response?.data || err.message)
    }
  }

  function forwardButton() {
    const nextNumber = entryNumber + 1
    loadEntryByNumber(nextNumber)
  }

  function backButton() {
    const previousNumber = Math.max(1, entryNumber - 1)
    loadEntryByNumber(previousNumber)
  }

  // Map button config -> click behavior, keeps JSX clean.
  const clickHandlers = {
    back: backButton,
    save: saveButton,
    forward: forwardButton,
    new: newButton,
  }

  return (
    <div className="button_container">
      {buttons.map(({ id, label, location }) => (
        <button
          type="button"
          key={id}
          className={`input_button ${location}`}
          onClick={clickHandlers[id]}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default App
