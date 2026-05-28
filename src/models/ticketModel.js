import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({

  eventId : {
    type : mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required:true
  },

   ticketName :{
    type: String,
    required: true
   },
   
   price : {
    type : Number,
    required : true,
    default : 0
   },

   totalNumber :{
    type: Number,
    required:true
   },

     soldCount: {
      type: Number,
      required: true,
      default: 0
    }

}, {timestamps:true})


const Ticket = mongoose.model("Ticket",ticketSchema);

export default Ticket;