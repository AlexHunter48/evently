import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({

   organizerId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required : true
  },

    title: {
       type: String,
       required : true,
       trim : true
  },


     category : {
     type: String,
     required : true,
     enum : [
      "Music & Nightlife",
      "Tech & Innovation",
      "Business & Networking",
      "Sports & Fitness",
      "Food & Drink",
      "Classes & Workshops",
      "Other"
    ],
     default : "Other"

  },
  location :{
   type: String,
   required:true
  },
  date:{
   type: String,
   required:true
  },

  time:{
     type: String,
     required:true
  },

  bannerImage :{
  type: String,
  required:true
  }


}, { timestamps:true})


const Event = mongoose.model("Event",eventSchema);

export default Event;