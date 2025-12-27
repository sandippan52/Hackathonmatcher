import React from "react";
import { useState } from "react";
import axios from "axios";
import "./Searchbar.css"
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;


const Searchbar = ({teamId}) => {

const [query, setQuery] = useState("");
const [results, setResults] = useState([]);


const [sentRequests, setSentRequests] = useState(new Set())


const handleSearch = async(e)=>{
  e.preventDefault();

  if(!query.trim()) return;

  try{
    const response = await axios.get(`http://localhost:3000/search?skill=${query}`)
    setResults(response.data)
  }
  catch(error){
    console.log("Error searching coders : ", error);
  }

}

const handleSendRequest = async(receiverId) =>{
  

  try{

    const res = await axios.post ("/send-request", {receiverId, teamId})
    
    alert(res.data.message)

    setSentRequests(prev => new Set(prev).add(receiverId))

  }catch(error){
    if(error.response){
      alert(error.response.data.message)
    } else{
      alert("Something went wrong")
    }

  }

}

const handleTeamCreation = async () => {
  try {
    const res = await axios.post("/create-team");
    alert("Team created successfully");
    console.log(res.data);
  } catch (err) {
    console.error(err);
    alert("Failed to create team");
  }
};



  return (
    <div className="search-box">
      <form onSubmit={handleSearch}>
        <input 
        type="text"
        placeholder="Search by skill.."
        value={query}
        onChange={(e)=>setQuery(e.target.value)}

        />
        <button type="submit"> search</button>
      </form>

      <div className="results">
          {
            results.length > 0 ?(
              results.map((coder)=>(
                <div key={coder._id} className="coder-card">
                  <h3>{coder.username}</h3>
                  <p><strong>Skills :</strong>{coder.skills}</p>
                  <p><strong>College :</strong>{coder.college}</p>
                  <p><strong>Year :</strong>{coder.year}</p>
                  <button
                  onClick={()=>handleSendRequest(coder._id)}
                  disabled = {sentRequests.has(coder._id)}
                  style={{backgroundColor: sentRequests.has(coder._id)?'grey':'green' }}
                  >Request to join</button>
                </div>
              ))
            ) : (
              <p>No results found</p>
            )
          }



      </div>

       <button onClick={handleTeamCreation}>
  Create Team First
</button>


    </div>
  )
}

export default Searchbar