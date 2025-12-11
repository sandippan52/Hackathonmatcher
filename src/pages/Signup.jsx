import React from 'react'
import { useForm } from 'react-hook-form'
import { data } from 'react-router-dom'
import "./Signup.css"
import axios from 'axios'



const Signup = () => {

  const {
    register,
    handleSubmit,
    watch,
    formState : {errors} 
  } = useForm()

  const onSubmit = async(data) => {

    try{
      const res = await axios.post("http://localhost:3000/signup", data)
      alert(res.data.message)
    }
    catch(err){
      if(err.response){
       alert(err.response.data.message);
      }else{
       alert("Something went wrong!!!!");
      }
    }
  }

  return (
    <div className='formBox'>
    <form onSubmit={handleSubmit(onSubmit)}>
     <input placeholder='username' {...register("username", {required:{value: true, message : "This field is required!!"}, minLength: {value : 5, message: "The minimum length is 5"}, maxLength:{value: 9, message:"The maximum length is 9"}})} type="text" /> 
     {errors.username && <div>{errors.username.message}</div>}

     <br />
     <input placeholder='email' {...register("email", {required:{value: true, message: "This field is required"}})} type="email" />
     {errors.email && <div>{errors.email.message}</div>}
      <br />
     <input placeholder='password' {...register("password", {required:{value:true, message:"This field is required"}, minLength:{value: 5, message: "The minimum length is 5"}, maxLength:{value :9, message : "The maximum length is 9"}})} type="text" />
     {errors.password && <div>{errors.password.message}</div>}
      <br />
     <input placeholder='skills' {...register("skills")} type="text" /> <br />
     <input placeholder='college' {...register("college")} type="text" /> <br />
     <input placeholder='course' {...register("course")} type="text" /> <br />
     <input placeholder='year' {...register("year")} type="number" /> <br />
     <button type="submit">Sign Up</button> 

    </form>

    </div>
  )
}

export default Signup