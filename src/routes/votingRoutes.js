import express from 'express'
import { createPoll, 
    addOption, 
    getPollResults, 
    closePoll,
    castVote, 
    getActivePolls} from '../controllers/votingController.js'

import verifyToken from '../middleware/authMiddleware.js'


const router = express.Router()

//organizer routes
router.post('/polls',verifyToken, createPoll)
router.post('/polls/:pollId/options', verifyToken, addOption)
router.get('/polls/:pollId/results', verifyToken, getPollResults)
router.patch('/polls/:pollId/close', verifyToken, closePoll)

// attendee routes
router.post('/polls/:pollId/vote', verifyToken, castVote)
router.get('/polls/active', verifyToken, getActivePolls)


export default router