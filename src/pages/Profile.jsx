import React from 'react'
import "./Profile.css"
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'

axios.defaults.baseURL ="http://localhost:3000"
axios.defaults.withCredentials = true



const Profile = () => {

const [user, setUser] = useState(null)
const [requests, setRequests] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState("")

useEffect(()=>{
  const fetchData = async()=>{
    try{

      const userRes = await axios.get("/me");
      setUser(userRes.data.user)

      const reqRes = await axios.get("/my-requests")
      setRequests(reqRes.data)

      setLoading(false)

    }catch(error){
      setError("You are not logged in.")
      console.log(error)
      setLoading(false)

    }
  }

   fetchData()


},[])

if(loading) return <p>Loading profile....</p>
if(error) return <p>{error}</p>


  return (
    <>
    <div className='profileContainer'>
    <div className='welcomeBox'>Hello {user.username}, Welcome to your own profile</div>
    <div className='skillBox'>The skills you have right now is -{user.skills}</div>
    <div className='occuBox'>College : {user.college} | year- {user.year}</div>
    <div className='reqBox'>
          <h3>Received Requests</h3>
          {requests.length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            requests.map((req) => (
              <div key={req._id} className="request-card" style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0', background: '#fff' }}>
                <p><strong>{req.sender.username}</strong> wants to join your team!</p>
                <p style={{ fontSize: '0.9em', color: '#555' }}>
                  Skills: {req.sender.skills} | College: {req.sender.college}
                </p>
                <div className="actions">
                  <button style={{ marginRight: '10px', background: 'green', color: 'white' }}>Accept</button>
                  <button style={{ background: 'red', color: 'white' }}>Decline</button>
                </div>
              </div>
            ))
          )}
        </div>
    <div className='histBox'>Your Previous Teams -</div>
    </div>




        
      







    </>
  )
}

export default Profile