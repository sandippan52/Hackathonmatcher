import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './Home.css';
import { useNavigate } from 'react-router-dom'
axios.defaults.baseURL= "http://localhost:3000";
axios.defaults.withCredentials = true;


const Home = () => {
  const [teams, setTeams] = useState([]);

 const [currentUserId, setCurrentUserId] = useState(null)


  const navigate = useNavigate()
  
  
  const fetchTeams = async () => {
    try {
      const res = await axios.get("http://localhost:3000/my-teams", {withCredentials:true});
      setTeams(res.data);
    } catch (error) {
      console.log("Not logged in or no teams");
    }
  };

  useEffect(() => {
    const fetchUser = async()=>{
      const res = await axios.get("/me")
      setCurrentUserId(res.data.user._id)
    }
    fetchUser();
    fetchTeams();
  }, []);

  const deleteTeam = async (teamId) =>{
     const confirmation = prompt(
    'Type YES to permanently delete this team'
  );

  if (!confirmation || confirmation.toLowerCase() !== 'yes') {
    alert('Team deletion cancelled');
    return;
  }
    try{
      await axios.post("/delete-team",{teamId}, {withCredentials:true});
      fetchTeams();
    }catch(err){
    console.log("DELETE TEAM ERROR:", err.response);
  alert(err.response?.data?.message || "Failed to delete team");
    }
  }

  const handleRename = async (teamId) => {
    const newName = prompt("Enter new team name:");
    if (!newName) return;

    try {
      await axios.post("http://localhost:3000/update-team-name", { teamId, newName });
      fetchTeams(); 
    } catch (error) {
      alert("Error renaming");
    }
  };

  const handleAdd = async(teamId)=>{
    navigate("/createteam",{
     state:{teamId}
    })
  }

  return (
      <div className="min-h-screen bg-gray-100 px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        My Teams
      </h2>

      {teams.length === 0 ? (
        <div className="text-gray-600 text-lg">
          No teams yet. First create a team by clicking the "Create Team" page's "Create Team First" button.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <div
              key={team._id}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition"
            >
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {team.name}
                </h3>

                { team.admin._id == currentUserId &&(
                <button
                onClick={()=> deleteTeam(team._id)}
                className="text-sm text-blue-600 hover:underline"
                >Delete Team
                </button>)
}
                

                { team.admin._id == currentUserId && (
                  <button
                  onClick={() => handleRename(team._id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Rename
                </button>)}
              </div>

              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Members
                </p>
                <div className="flex flex-wrap gap-2">
                  {team.members.map((member) => (
                    <span
                      key={member._id}
                      className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
                    >
                      {member.username}
                    </span>
                  ))}

                 


                </div>
              </div>

              

              
              {team.admin._id === currentUserId && (
  <button className="mt-auto bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition" onClick={() => handleAdd(team._id)}>
    Add New Members
  </button>
)}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;