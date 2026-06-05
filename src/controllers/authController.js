import express from "express"

import bcrypt from "bcrypt"

import jwt from "jsonwebtoken"

import User from "../models/userModel.js"



export const registerUser = async(req,res)=> {

  try {
  
   const {username,email,password} = req.body

   if (!username || !email || !password) { 
    return res.status(400).json({message:"All fields are required"})
    }

   const userExists = await User.findOne({email})

   if (userExists) {
    return res.status(400).json({message:"User with this email already exists"})
    } 

   const salt = await bcrypt.genSalt(10)

   const hashedPassword =  await bcrypt.hash(password,salt)

    const newUser= await User.create({
        username : username,
        email : email,
        password : hashedPassword

    })
   

    res.status(201).json({ message:"Account created succesfully "})

   } catch(err) {

     console.log("Error creating user:",err)

    res.status(500).json({message:err.message})
   }
}


export const loginUser = async(req,res)=> {

   try {

   const {email,password} = req.body

   if ( !email || !password) { 
    return res.status(400).json({message:"All fields are required"})
    }

   const user = await User.findOne({email})

   if(!user) {
    return res.status(400).json({message:"Invalid email or password"})
   }
  
   const isMatch = await bcrypt.compare(password,user.password)

  if (!isMatch) {
    return res.status(400).json({ message:"Invalid email or  Password"})
  }

  const token = jwt.sign(
   {
   id:user._id,
   role:user.role

  },
  process.env.JWT_SECRET,

  {expiresIn:"1d"}

  );


 res.status(200).json({
    message:"logged in succesfully",
    token: token,
    user : {
      id:user._id,
      username:user.username,
      role :user.role
    }
 })



 } catch(error){
   
    console.log("Error loggin in user:",error.message)
    res.status(500).json({message:error.message})

 }

}



