import dotenv from "dotenv"
dotenv.config()

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'

import {Coder} from './models/CoderData.js'
import { Request } from './models/Request.js'
import { Team } from './models/Team.js'

import session from 'express-session'
import MongoStore from 'connect-mongo'
import cors from "cors"
import bcrypt from "bcryptjs";


console.log("MONGO_URI =", process.env.MONGO_URI);


await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");


// app.set("trust proxy", 1);


const app = express()
const port = process.env.PORT || 3000

app.set("trust proxy", 1);



app.use(
  cors({
  origin:"https://hackathon-matcher.vercel.app",
  credentials: true

}))
app.use(express.json());


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


app.use(
  session({
  name: "hackathonmatcher.sid",
  secret : process.env.SESSION_SECRET,
  resave : false,
  saveUninitialized : false,
  store : MongoStore.create({mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
  }),
  cookie : {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24,

  }

  })
)

app.get("/", (req, res) => {
  res.status(200).send("HackathonMatcher backend is running 🚀");
});


app.post("/signup", async(req, res)=>{

try{
// console.log("BODY:", req.body);
const{username,email, password, skills, college, course, year } = req.body

const hashedPassword = await bcrypt.hash(password,10)

const existing = await Coder.findOne({email})

if(existing){
  return res.status(400).json({message : "User already exists."})
}

const newCoder = new Coder({username:username, email: email, password:hashedPassword,skills : skills, college:college, course:course, year:year})

await newCoder.save();

res.status(201).json({message:"User saved successfully."})

}catch(error){
  console.log(error)
  res.status(500).json({message:"Error in signning up."})
  
}

})

app.post("/login",async(req,res)=>{
  const {email, password} = req.body

  const user = await Coder.findOne({email})

  if(!user) return res.status(400).send("user not found")

    const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch) return res.status(400).send("Invalid Credential") 
    
    req.session.userId = user._id;
    
    res.status(200).json({
      message: "Login successful",
      user:{
        id: user._id,
        username : user.username,
        email : user.email
      }
    })

})

function requireLogin(req, res, next){
  if(!req.session.userId){
    return res.status(401).json({message:"Unauthorized"})
  }
next()

}

app.post("/logout", (req,res)=>{
  req.session.destroy(()=>{
    res.clearCookie("hackathonmatcher.sid");
    res.json({message:"Logged Out"})
  })
})

app.get("/me", async(req,res)=>{
if(!req.session.userId){
   return res.status(401).json({loggedIn : false})
}

const user = await Coder.findById(req.session.userId).select("-password")
res.json({
  loggedIn:true,
  user
})

})




app.get("/search",requireLogin, async(req, res)=>{

  try{
    const {skill} = req.query
    
    if(!skill || skill.trim() ===""){
      return res.status(400).json({message :"Skill is required"})
    }
    
    const results = await Coder.find({
      skills : {$regex : skill, $options : "i" }
    }).select("-password")

    
    
    res.status(200).json(results)
  }
  catch(error){
    console.log(error)
  }

})


app.post("/send-request", requireLogin, async(req,res)=>{
  

try{
  const {receiverId,teamId} = req.body
  const senderId = req.session.userId

  if (!teamId) {
    return res.status(400).json({ message: "No Team ID provided. Please select a team first." });
  }

  const teamExists = await Team.findById(teamId);
  if (!teamExists) {
    return res.status(404).json({ message: "Team not found." });
  }

  if(senderId==receiverId){
    return res.status(400).json({message:"You can not request yourself"})
  }

  const existingRequest = await Request.findOne({sender:senderId, receiver: receiverId, team:teamId})

  if(existingRequest){
    return res.status(400).json({message:"Request already sent"})
  }
 
  const newRequest = new Request({
    sender:senderId,
    receiver:receiverId,
    team : teamId
  });

  await newRequest.save();
  res.status(200).json({message:"Request send successfully"})

}catch(error){

  console.log(error);
  res.status(500).json({message:"Error sending request"})
}

})

app.get("/my-requests",requireLogin, async(req,res)=>{

  try{

    const userId = req.session.userId

    const requests = await Request.find({receiver:userId, status:"pending"})
         .populate('sender' , 'username skills college year')
         .sort({createdAt : -1});
 
  
    res.status(200).json(requests)
  }catch(error){
    console.log(error)
    res.status(500).json({message:"Error fetching requests"})
  }


} )

// app.post("/accept-request", requireLogin, async(req,res)=>{
//  try {
//     const teamId = req.body
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Error accepting request" });
//   }
// })
// app.post("/accept-request", requireLogin, async (req, res) => {
//   try {
//     const { teamId, memberId } = req.body;

//     if (!teamId || !memberId) {
//       return res.status(400).json({ message: "teamId and memberId required" });
//     }

//     const team = await Team.findById(teamId);

// console.log("teamId:", teamId);
// console.log("memberId:", memberId);
// console.log("team.members (raw):", team.members);
// console.log(
//   "team.members as strings:",
//   team.members.map(m => m.toString())
// );


//     if (!team) {
//       return res.status(404).json({ message: "Team not found" });
//     }

//     
//     const alreadyInTeam = team.members.some(
//       m => m.toString() === memberId.toString()
//     );

//     if (alreadyInTeam) {
//       return res.status(400).json({ message: "User already in team" });
//     }

//     team.members.push(memberId);
//     await team.save();

//     await Request.deleteMany({ team: teamId, sender: memberId });

//     res.status(200).json({ message: "Member added to team" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to accept" });
//   }
// });


app.post("/accept-request", requireLogin, async (req, res) => {
  console.log("ACCEPT ENDPOINT HIT");
  console.log("teamId received:", req.body.teamId);
  console.log("memberId received:", req.body.memberId);
  console.log("requestID received:", req.body.requestID);

  const { teamId, memberId, requestID } = req.body;

  
  // const updatedTeam = await Team.findByIdAndUpdate(
  //   teamId,
  //   { $push: { members: memberId } }, 
  //   { new: true }
  // );

  const updatedTeam = await Team.findByIdAndUpdate(
    teamId,
    {$addToSet: {members:memberId}},
    {new: true}
  )


  await Request.findByIdAndDelete(requestID)

  console.log("UPDATED TEAM:", updatedTeam);

  res.json({
    message: "Member added to team",
    team: updatedTeam
  });
});

app.post("/decline-request", requireLogin, async (req, res) => {
  try {
    const { requestId } = req.body;



    if (!requestId) {

      return res.status(400).json({ message: "requestId required" });
    }

    await Request.findByIdAndDelete(requestId);

    res.json({ message: "Request declined" });
  } catch (err) {


    console.error(err);

    res.status(500).json({ message: "Failed to decline request" });
  }
});





app.get("/my-teams",requireLogin, async(req,res)=>{
  try{

    const teams = await Team.find({members:req.session.userId})
    .populate('members','username')
    .populate('admin',' _id username ')
    .sort({createdAt: -1})

    

res.status(200).json(teams)    

  }catch(error){
    console.log(error)
    res.status(500).json({message:"Error fetching teams"})
  }
})

app.post("/delete-team", requireLogin,async(req,res) =>{
res.send("DELETE TEAM ROUTE HIT");
try{
const {teamId} = req.body
await Team.findByIdAndDelete(teamId)
res.status(200).json({message:"Team Deleted"})
}
catch(err){
console.log(err)
res.status(500).json({message:"Error deleting team."})
}


})

app.post("/update-team-name", requireLogin, async(req,res)=>{
  try{

    const{teamId, newName}= req.body
    await Team.findByIdAndUpdate(teamId,{name:newName})
    res.status(200).json({message:"Team renamed"})
  }catch(error){
    console.log(error)
    res.status(500).json({message:"Error updating name"})
  }
})

app.post("/create-team", requireLogin, async (req, res) => {
  console.log("CREATE TEAM ROUTE HIT");
  const team = new Team({
    members: [req.session.userId],
    admin: req.session.userId
  });
  await team.save();
  res.json(team);
});






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




