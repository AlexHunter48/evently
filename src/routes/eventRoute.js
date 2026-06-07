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
router.get("/", getAllEvents);
router.get("/organizer/:organizerId", getOrganizerEvents);
router.get("/:id", getSingleEvent);
router.patch("/:id",verifyToken, updateEvent);
router.delete("/:id",verifyToken, deleteEvent);
router.post("/saveevent/:eventId", verifyToken,saveEvent);
router.delete("/unsave/:eventId", verifyToken,unsaveEvent);
router.get("/saved",verifyToken, getSavedEvents);

export default router;