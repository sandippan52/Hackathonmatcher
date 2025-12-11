import mongoose from "mongoose";
import path from "path";
// import { Coder } from "../models/CoderData.js";
import { Coder } from "./models/CoderData.js";
import { fileURLToPath } from "url";
import express from 'express';
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv"
import bcrypt from "bcryptjs"




dotenv.config();

const app = express();
const port = 3000
let a = await mongoose.connect("mongodb://localhost:27017/CoderData")

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("Server dirname:", __dirname);

app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use(session({
    secret : "supersecretkey",
    resave : false,
    saveUninitialized : false,
    store : MongoStore.create({mongoUrl: "mongodb://localhost:27017/CoderData"}),
    cookie: {maxAge: 1000*60*60}

}))

// let a = await mongoose.connect("mongodb://localhost:27017/CoderData")

app.post("/signup",async(req,res)=>{

try{

const{username, email, password, skills, college, course, year}= req.body

const hashedPassword = await bcrypt.hash(password,10);

const existing = await Coder.findOne({email})

if(existing){
    return res.status(400).json({message: "User already exists"})
}
const newCoder = new Coder({username:username, email: email, password: hashedPassword, skills:skills, college:college, course:course, year:year })

await newCoder.save();

res.status(201).json({message: "User saved successfully"})

}
catch(error){
console.log(error)
res.status(500).json({message: "Error in signning up"})
}

})

app.get("/search", async(req, res)=>{

  try{
    const {skill} = req.query
    
    if(!skill || skill.trim() ===""){
      return res.status(400).json({message :"Skill is required"})
    }
    
    const results = await Coder.find({
      skills : {$regex : skill, $options : "i" }
    })
   
    res.status(200).json(results)
  }
  catch(error){
    console.log(error)
  }

})






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})