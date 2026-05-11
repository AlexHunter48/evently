const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String,   
    },
    password: { 
        type: String,  
        required: true, 
    },
    phoneNumber: { 
        type: Number, 
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model("User", userSchema);