import React from 'react'
import "./Home.css"
const Home = () => {
  return (
    <>
    <div>
     <div className='textContainer'>
      <input type="text" placeholder='Type skills to search coders' />
    </div> 
    <div className='hackColumn'>
     The information about new hackathon updates 
    </div>
    </div>
    </>
  )
}

export default Home