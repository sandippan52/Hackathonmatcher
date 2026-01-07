import React from 'react'
import Searchbar from '../components/Searchbar'
import { useLocation } from 'react-router-dom'
const CreateTeam = () => {

const location = useLocation();
const teamId = location.state?.teamId



  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800">
             Add Members to Your Team
          </h2>
          <p className="text-gray-600 mt-1">
            Search developers by skill and send them a team request.
          </p>
        </div>

        
        <div className="bg-white shadow rounded-lg p-6">
          <Searchbar teamId={teamId} />
        </div>

        
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-700 font-medium">
            Results
          </p>
          <p className="text-gray-500 text-sm mt-1">
            These are the developers found based on the skill you searched for.
          </p>
        </div>

      </div>
    </div>
  )
}

export default CreateTeam