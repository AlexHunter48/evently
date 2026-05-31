import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const orderSchema =  new mongoose.Schema({

    event:{
       type : mongoose.Schema.Types.ObjectId,
       ref: "Event",
       required:true
    },

    name:{
        type:String,
        required:true,
        trim : true
    },

    email:{
        type:String,
        required:true,
        trim :true,
    },
    phoneNo:{
        type:String,
        required:true
    },
    price :{
        type:Number,
        required:true
    },
    quantity :{
        type: Number,
        required:true,
        min: 1
    },
    totalPrice :{
        type:Number,
        required:true
    },
    paymentStatus:{
        type: String,
        enum: ['pending','completed','failed'],
        default: 'pending'
    },
    reference: {
        type: String,
        default: ()=> `REF-${uuidv4().split('-')[0].toUpperCase()}`,
        unique: true
    }


},{timestamps:true});

const Order = mongoose.model("Order", orderSchema);

export default Order