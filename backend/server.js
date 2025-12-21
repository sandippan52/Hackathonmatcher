import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'

import {Coder} from './models/CoderData.js'
import { Request } from './models/Request.js'

import session from 'express-session'
import MongoStore from 'connect-mongo'
import cors from "cors"
import bcrypt from "bcryptjs";





const a = await mongoose.connect("mongodb://localhost:27017/CoderData")

const app = express()
const port = 3000
app.use(cors({
  origin:"http://localhost:5173",
  credentials: true
}))
app.use(express.json());


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


app.use(
  session({
  name: "hackathonmatcher.sid",
  secret : "supersecretkey",
  resave : false,
  saveUninitialized : false,
  store : MongoStore.create({mongoUrl: "mongodb://localhost:27017/CoderData"}),
  cookie : {
    maxAge : 1000*60*60,
    httpOnly: true
  }

  })
)

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
  const {receiverId} = req.body
  const senderId = req.session.userId

  if(senderId==receiverId){
    return res.status(400).json({message:"You can not request yourself"})
  }

  const existingRequest = await Request.findOne({sender:senderId, receiver: receiverId})

  if(existingRequest){
    return res.status(400).json({message:"Request already sent"})
  }
 
  const newRequest = new Request({
    sender:senderId,
    receiver:receiverId,
    status:'pending'
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








app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




