import React from 'react'
import { NavLink } from 'react-router-dom'
import "./Navbar.css"

const Navbar = () => {
  return (
    <div>
        <nav>
            <ul>
                <NavLink className={(e)=>{return e.isActive?"red":""}} to="/"><li>Home</li></NavLink>
                <NavLink className={(e)=>{return e.isActive?"red":""}} to="/signup"><li>Signup</li></NavLink>
                <NavLink className={(e)=>{return e.isActive?"red":""}} to="/login"><li>Login</li></NavLink>
                <NavLink className={(e)=>{return e.isActive?"red":""}} to="/createteam"><li>Create Team</li></NavLink>
                <NavLink className={(e)=>{return e.isActive?"red":""}} to="/profile"><li>Your Profile</li></NavLink>
            </ul>
        </nav>
    </div>
  )
}

export default Navbar