import React from 'react'
import "./Profile.css"
const Profile = () => {
  return (
    <>
    <div className='profileContainer'>
    <div className='welcomeBox'>Hello{}, Welcome to your own profile</div>
    <div className='skillBox'>The skills you have right now is -</div>
    <div className='occuBox'>College {} | year {}</div>
    <div className='reqBox'>Received Requests</div>
    <div className='histBox'>Your Previous Teams -</div>
    </div>
    </>
  )
}

export default Profile