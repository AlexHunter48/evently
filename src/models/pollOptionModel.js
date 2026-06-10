import mongoose from 'mongoose';

const pollOptionSchema = new mongoose.Schema({
    poll: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    photoUrl:{
        type: String,
        trim: true
    },
    votesCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

export default mongoose.model("PollOption", pollOptionSchema);