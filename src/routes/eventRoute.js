import express, { Router } from "express"

import { createEvent,
     deleteEvent,
      getAllEvents, 
      getSingleEvent,
       updateEvent, 
       getOrganizerEvents,
       saveEvent,
       unsaveEvent,
       getSavedEvents
    } from "../controllers/eventController.js";

    import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createEvent);
router.post("/", createEvent);
router.get("/", getAllEvents);
router.get("/organizer/:organizerId", getOrganizerEvents);
router.get("/:id", getSingleEvent);
router.patch("/:id",verifyToken, updateEvent);
router.delete("/:id",verifyToken, deleteEvent);
router.post("/save", saveEvent);
router.post("/unsave", unsaveEvent);
router.get("/saved/:userId", getSavedEvents);

export default router;