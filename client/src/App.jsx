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
      <Header />
      <Notebook />
      <Buttons/>
    </>
  )
}

// ============================================
// header
// ============================================

function Header() {
  return (
    <div className="heading_bar">
      <div className="name_container">
        <textarea rows="1" cols="10">name</textarea>
      </div>
      <div className="title_container">
        <textarea rows="1" cols="15">title</textarea>
      </div>
      <div className="date_container">
        <textarea rows="1" cols="5" > d/m/y</textarea>
      </div>
    </div>
  )
}

function Notebook() {
  return (
    <div className="note_book">
      <div className="entry_container">
        <textarea rows="35" cols="120">lorem ipsum </textarea>
      </div>
    </div>
  )
}

function Buttons(name_container, date_container, title_container, entry_container){
  const buttons = [
  { id: 'back', label: 'Back',location: 'left'},
  { id: 'save', label: 'Save', location: 'center-left'},
    { id: 'forward', label: 'Forward', location: 'right' },
    { id: 'new', label: 'New', location: 'center-right' },
  ];

    async function SaveButton(name_container, date_container, title_container, entry_container){
      let name=document.getElementById("name_container").value
      let date=document.getElementById("date_container").value
      let title=document.getElementById("title_container").value
      let entry=document.getElementById("entry_container").value
      onclick={addData}
      async function addData(data) {
        try {
          const newData = new User(data);
          const savedData = await newData.save();
          console.log('data saved:', savedData);
        } catch (error) {
          console.error('Error saving user:', error.message);
        }
      }
      
      // Example usage:
      addata({ name: {name}, title:{title}, date:{date}, entry:{entry}});
      
    }

  return(

    <div className="button_container">
      {buttons.map(({ id, label, location }) => (
       <button
       type="button"
       key={id}
       className={`input_button ${location}`}
       onClick={id === 'save' ? SaveButton : undefined}
     >
       {label}
     </button>
      ))}
    </div>

   
  )

}


export default App
