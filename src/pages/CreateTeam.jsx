import React from 'react'
import Searchbar from '../components/Searchbar'
import { useLocation } from 'react-router-dom'
const CreateTeam = () => {

const location = useLocation();
const teamId = location.state?.teamId



  return (
    <>
    <div>
     <div >
      <Searchbar teamId={teamId}/>
      {console.log(teamId)}
    </div> 
    <div className='hackColumn'>
     These are the coders found based upon skillset..
    </div>
    </div>
    </>
  )
}

export default CreateTeam