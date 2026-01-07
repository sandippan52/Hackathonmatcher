  import React from 'react'
  // import "./Profile.css"
  import { useEffect } from 'react'
  import { useState } from 'react'
  import axios from 'axios'


  axios.defaults.baseURL ="http://localhost:3000"
  axios.defaults.withCredentials = true



  const Profile = () => {

  const [user, setUser] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")


  useEffect(()=>{
    const fetchData = async()=>{
      try{

        const userRes = await axios.get("/me");
        setUser(userRes.data.user)

        const reqRes = await axios.get("/my-requests")
        setRequests(reqRes.data)

        setLoading(false)

      }catch(error){
        setError("You are not logged in.")
        console.log(error)
        setLoading(false)

      }
    }

    fetchData()


  },[])

  const handleDecline = async(requestId)=>{
try {
   await axios.post("/decline-request", { requestId });

} 
catch (err) {
 alert("Failed to decline.")  
}
  }

  const handleAccept = async(req)=>{
    console.log("ACCEPT CLICKED");
    console.log("teamId being sent:", req.team);
    console.log("memberId being sent:", req.receiver);
    try{

        const res = await axios.post("http://localhost:3000/accept-request",{teamId :req.team, memberId : req.receiver, requestID : req._id },{withCredentials:true})
        alert(res.data.message)
        //  setRequests(prev => prev.filter(req => req._id !== requestId))
        //  window.location.href = "/";
    }catch(error){
      console.error("AXIOS ERROR:", error.response?.data || error.message);
      alert("Failed to accept")

    }
  }

  if(loading) return <p>Loading profile....</p>
  if(error) return <p>{error}</p>


    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800">
           Hello {user.username}
        </h2>
        <p className="text-gray-600 mt-1">
          Welcome to your profile
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">Skills</p>
          <p className="font-medium text-gray-800">{user.skills}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">College & Year</p>
          <p className="font-medium text-gray-800">
            {user.college} · Year {user.year}
          </p>
        </div>
      </div>

      
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
           Received Requests
        </h3>

        {requests.length === 0 ? (
          <p className="text-gray-500">No pending requests.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {req.sender.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    Skills: {req.sender.skills} · College: {req.sender.college}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(req)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Accept
                  </button>
                  <button
                  onClick={()=> handleDecline(req._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
    </div>
    )
  }

  export default Profile