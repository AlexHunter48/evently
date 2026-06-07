import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({

   organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

eventType: {
   type: String,
   enum: ["Free", "Paid"],
   default: "Free"
},

    title: {
       type: String,
       required: true,
       trim: true
  },

description: {

   type: String,
   required: true,
   trim: true
},


     category: {
     type: String,
     required: true,
     enum: [
      "Music & Nightlife",
      "Tech & Innovation",
      "Business & Networking",
      "Sports & Fitness",
      "Food & Drink",
      "Classes & Workshops",
      "Other"
    ],
     default: "Other"

  },
  location: {
   type: String,
   required: true
  },
  
capacity: {
   type: Number,
   required: true
},

tickets: [ {
   type: {
   type: String,
   enum: [ "Standard", "Premium", "VVIP"],
   
},

price: {
   type: Number,
   
},

quantity: {
   type: Number,
   
},
sold: {
   type: Number,
   default: 0
}
}
],

  date: {
   type: Date,
   required: true
  },

  time: {
     type: String,
     required: true
  },

  bannerImage: {
  type: String,
  required: true
  },

  status: {
   type: String,
   enum: [
      "Pending Approval",
      "Upcoming",
      "Ongoing",
      "Completed",
      "Cancelled",
      "Sold Out"
   ],
   default: "Upcoming"
  }


}, { timestamps: true});   

eventSchema.index({ title: "text", description: "text" });
eventSchema.index({ category: 1 });
eventSchema.index({ location: 1 });
eventSchema.index({ date: 1 });

const Event = mongoose.model("Event",eventSchema);

export default Event;