import mongoose from "mongoose";

const orderSchema =  new mongoose.Schema({

     eventId : {
       type : mongoose.Schema.Types.ObjectId,
       ref: "Event",
       required:true
    },

      ticketId :{
       type : mongoose.Schema.Types.ObjectId,
       ref: "Ticket",
       required:true

    },

    guestName:{
        type:String,
        required:true,
        trim : true
    },

    guestEmail :{
        type:String,
        required:true,
        trim :true,
    },

    quantity :{
        type: Number,
        required:true
    },

    totalPrice :{
        type:Number,
        required:true
    },

    ticketCode :{
        type:String,
        unique:true,
        required:true
    }





},{timestamps:true});

const Order = mongoose.model("Order", orderSchema);

export default Order