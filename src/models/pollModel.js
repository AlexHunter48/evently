import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    title: {
        type: String,
        required: true,
        trim: true
    },

    pollType: {
        type: String,
        enum: ['nominee', 'survey'],
        required: true
    },
    startTime:{
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    isOpen:{
        type: Boolean,
        default: false
    },
    resultsVisible: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })    
    
export default mongoose.model("Poll", pollSchema);