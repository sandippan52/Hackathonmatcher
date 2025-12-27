import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import { useNavigate } from 'react-router-dom'
axios.defaults.baseURL= "http://localhost:3000";
axios.defaults.withCredentials = true;


const Home = () => {
  const [teams, setTeams] = useState([]);
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
    fetchTeams();
  }, []);

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
    <div className="home-container">
      <h2>My Teams</h2>
      
      <div className="team-grid">
        {teams.length === 0 ? <p>No teams yet. Connect with someone!</p> : (
          teams.map(team => (
            <div key={team._id} className="team-card">
              <div className="team-header">
                <h3>{team.name}</h3>
                <button onClick={() => handleRename(team._id)} className="edit-btn">Edit Team Name</button>
              </div>
              
              <div className="members-list">
                <p><strong>Members:</strong></p>
                {team.members.map(member => (
                  <span key={member._id} className="member-tag">
                    {member.username}
                  </span>
                ))}
              </div>
              <button onClick={()=>handleAdd(team._id)} >Add New Members</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;