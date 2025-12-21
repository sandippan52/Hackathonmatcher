import React from 'react'
import { useForm } from 'react-hook-form'
import { data } from 'react-router-dom'
import './Signup.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
axios.defaults.baseURL = "http://localhost:3000"
axios.defaults.withCredentials = true





const Signup = () => {

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState : {errors}
  } = useForm()

  const onSubmit = async(data) => {
    try{
     const res = await axios.post("/signup", data)
     alert(res.data.message)
     navigate("/login")
    }
    catch(err){
      if (err.response){
        alert(err.response.data.message)
      } else{
        alert("Something went wrong!")
      }

    }
  }

  return (
    <div className='formBox'>
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username", {required:{value: true, message:"This field is required"},maxLength:{value:10, message:"Maximum permitted length is 10" }, minLength:{value:5, message:"Minimum permitted length is 5"}})} placeholder='Username'/>
      {errors.username && <span></span>}
       <br />
      <input {...register("email", {required:{value:true, message:"This field is required"}})} placeholder='Email'/> <br />
      <input {...register("password",{required:{value:true, message:"This field is required"}, maxLength:{value:10, message:"Maximum password length is 10"}, minLength:{value:5, message:"Minimum password length is 5"}})} placeholder='Password'/>
      {errors.password &&<div className='red'>{errors.password.message}</div>}
       <br />
      <input {...register("skills",{required:{value:true, message:"Skill is required to create an account"}})} placeholder='Skills'/> <br />
      <input {...register("college")} placeholder='College'/> <br />
      <input {...register("course")} placeholder='Course'/> <br />
      <input {...register("year")} placeholder='year' type='number'/> <br />
      <button type='input'>Sign Up</button>

    </form>
    </div>
  )
}

export default Signup