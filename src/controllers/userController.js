 import express from "express"

 
 import User from "../models/userModel.js"




export const getCurrentUser = async(req,res) => {
   
    try{
  
    const user = req.user
    
    return res.status(200).json(user)

  } catch(error) {
 
    console.log("Error retrieving user:", error.message)
    return res.status(500).json({message:"Error retrieving user"})
  }

}




export const getAllUsers = async(req,res)=> {

  try {

  const users = await User.find().select("-password");

  return res.status(200).json(users)

  } catch(error) {

  console.log("Error retrieving user:", error.message)

  return res.status(500).json({message:"Error retrieving user"})

  }


}