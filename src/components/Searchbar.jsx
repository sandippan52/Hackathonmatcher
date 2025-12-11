import React from "react";
import { useState } from "react";
import axios from "axios";
import "./Searchbar.css"



const Searchbar = () => {

const [query, setQuery] = useState("");
const [results, setResults] = useState([]);
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
                </div>
              ))
            ) : (
              <p>No results found</p>
            )
          }



      </div>



    </div>
  )
}

export default Searchbar