import Poll from '../models/pollModel.js'
import Vote from '../models/votesModel.js'
import PollOption from '../models/pollOptionModel.js'
import Order from '../models/orderModel.js'
import Ticket from '../models/ticketModel.js'


//organizer Functions
const createPoll = async (req, res) => {
// create a poll and save it to the database
try {
const {title, pollType, startTime, endTime} = req.body
const {eventId} = req.params
const createdBy = req.user._id

if(!title || !pollType || !startTime || !endTime){
    return res.status(400).json({message: "Please provide all required fields"})
}
if(endTime <= startTime) {
    return res.status(400).json({ message: "End time must be after start time" })
}
const poll = await Poll.create({
    title,
    pollType,
    startTime,
    endTime,
    event: eventId,
    createdBy
})

return res.status(201).json({message: "Poll created successfully", poll})


} catch(error){
    return res.status(500).json({message: "Error creating poll", error: error.message})
}

}

const addOption = async (req, res) => {
// add an option to a poll
try {
    const { pollId } = req.params
    const { name} = req.body

    if(!name){
        return res.status(400).json({message: "Please provide option name"})
    }
    const poll = await Poll.findById(pollId)

    if(!poll){
        return res.status(404).json({message: "Poll not found"})
    }

    const option = await PollOption.create({
        poll: pollId,
        name
    })

    return res.status(201).json({message: "Option added successfully", option})


    } catch(error){
    return res.status(500).json({message: "Error adding option", error: error.message})
}
}

const getPollResults = async (req, res) => {
// get the results of a poll
const {pollId} = req.params
try{
const poll = await Poll.findById(pollId)
if(!poll){
    return res.status (404).json({
        message: "Poll not found"
    })
}
if(!poll.resultsVisible){
    return res.status(403).json({
        message: "Poll results are not visible yet"
    })
}

const options = await PollOption.find({ poll: pollId }).sort({ voteCount: -1 })

return res.status(200).json({message: "Poll results retrieved successfully", poll: {...poll.toObject(), options}})

}catch(error){
    return res.status(500).json({message: "Error retrieving poll results", error: error.message})
}
}


const closePoll = async (req, res) => {
// close a poll and prevent further voting
try{
const {pollId} = req.params
    const poll  = await Poll.findById(pollId)
    if (!poll){
        return res.status(404).json({message: "Poll not found"})
    }
    poll.isOpen = false;
    poll.resultsVisible = true

    await poll.save()
    
    return res.status(200).json({message: "Poll closed successfully", poll})
} catch(error){
    return res.status(500).json({
        message: "Error closing poll", 
        error: error.message})
}
}


// attendee Functions
const castVote = async (req, res) => {
// cast a vote for a poll option

const {pollId,optionId} = req.body
const voter = req.user._id
const {eventId} = req.params
try{
const poll = await Poll.findById(pollId)
if(!poll){
    return res.status(404).json({message: "Poll not found"})    
}
if(!poll.isOpen){
    return res.status(400).json({message: "Poll is closed"})
}
if( new Date() < poll.startTime || new Date() > poll.endTime){
    return res.status(400).json({message: "Poll is not active"})
}

const order = await Order.findOne({
    event: eventId,
    user: voter,
    paymentStatus: "completed"
})

if (!order){
    return res.status(403).json({message: "You must have a completed order to vote"})

}
const ticket = await Ticket.findOne({
    order: order._id,
    status: "used"
})
if (!ticket){
    return res.status(403).json({message: "You must have a used ticket to vote"})
}

const existingVote = await Vote.findOne({
    poll:pollId,
    user: voter
})

if(existingVote){
    return res.status(403).json({message: "You have already voted in this poll"})
}
const createVote = await Vote.create({
    poll: pollId,
    option: optionId,
    user: voter,
    event: eventId
})

const increasevoteCount = await PollOption.findByIdAndUpdate(optionId, {$inc: {voteCount: 1}}, {new: true})

return res.status(201).json({message: "Vote cast successfully", vote: createVote, updatedOption: increasevoteCount})
} catch(error){
    return res.status(500).json({message: "Error casting vote", error: error.message})
}
}

const getActivePolls = async (req, res) => {
// get the active polls

const {eventId} = req.params
try {
const polls = await Poll.find({ event: eventId, isOpen: true })
const pollsWithOptions = await Promise.all(
    polls.map(async (poll) => {
        const options = await PollOption.find({ poll: poll._id })
        return { ...poll.toObject(), options }
    })
)

return res.status(200).json({message: "Active polls retrieved successfully", polls: pollsWithOptions})
} catch(error){
    return res.status(500).json({message: "Error retrieving active polls", error: error.message})
}
}
export {
    createPoll,
    addOption,
    getPollResults,
    closePoll,
    castVote,
    getActivePolls
}