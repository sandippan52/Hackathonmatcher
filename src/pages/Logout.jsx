import React from 'react'
import axios from 'axios'

axios.defaults.baseURL = "http://localhost:3000"
axios.defaults.withCredentials = true



const Logout = () => {

const handleLogout = async() => {

try{
await axios.post("/logout")
alert("Successfullty logged out")
}
catch(error){
console.log(error)
}



}



  return (
  <>
  <div>Logout</div>
  <button onClick={handleLogout}>Log Out</button>
  
  </>
    
  )
}

export default Logout