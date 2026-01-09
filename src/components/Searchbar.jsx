import React from "react";
import { useState } from "react";
import axios from "axios";
// import "./Searchbar.css"
// axios.defaults.baseURL = "http://localhost:3000";
// axios.defaults.withCredentials = true;
axios.defaults.baseURL= import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const Searchbar = ({teamId}) => {

const [query, setQuery] = useState("");
const [results, setResults] = useState([]);


const [sentRequests, setSentRequests] = useState(new Set())


const handleSearch = async(e)=>{
  e.preventDefault();

  if(!query.trim()) return;

  try{
    const response = await axios.get(`/search?skill=${query}`)

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
     <div className="max-w-4xl mx-auto mt-10 px-4">
      
    
      <form
        onSubmit={handleSearch}
        className="flex gap-3 bg-white p-4 rounded-xl shadow-md"
      >
        <input
          type="text"
          placeholder="Search developers by skill..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.length > 0 ? (
          results.map(coder => (
            <div
              key={coder._id}
              className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-3"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {coder.username}
              </h3>

              <p className="text-sm text-gray-600">
                <span className="font-medium">Skills:</span> {coder.skills}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">College:</span> {coder.college}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Year:</span> {coder.year}
              </p>

              <button
                onClick={() => handleSendRequest(coder._id)}
                disabled={sentRequests.has(coder._id)}
                className={`mt-3 px-4 py-2 rounded-lg text-white transition
                  ${
                    sentRequests.has(coder._id)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                {sentRequests.has(coder._id)
                  ? "Request Sent"
                  : "Request to Join"}
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No results found
          </p>
        )}
      </div>

      
      <div className="flex justify-center mt-10">
        <button
          onClick={handleTeamCreation}
          className="bg-purple-600 text-white px-8 py-3 rounded-xl shadow-md hover:bg-purple-700 transition"
        >
          Create Team First
        </button>
      </div>
    </div>
  )
}

export default Searchbar