
import mongoose from "mongoose";
import Event from "../models/eventModel.js"

import User from "../models/userModel.js";

export const createEvent = async (req, res) => {
  try {
    const organizerId = req.user._id;
    const {
      eventType,
      title,
      description,
      category,
      location,
      capacity,
      tickets,
      date,
      time,
      bannerImage,
    } = req.body;

    const user = await User.findById(organizerId);

if (!user) {
  return res.status(404).json({
    message: "User not found"
  });
}

if (user.role !== "organizer") {
  return res.status(403).json({
  message:  "Only organizers can create events"
  });
}


if (
  !eventType ||
  !organizerId ||
  !title ||
  !description ||
  !category ||
  !location ||
  !capacity ||
  !date ||
  !time ||
  !bannerImage 
) {
  return res.status(400).json({
    message: "All required fields must be provided"
  });
}

if (eventType === "Paid") {
  if (!tickets || tickets.length === 0) { 
    return res.status(400).json({
message: "Paid events must have tickets"
  });
}


const invalidTicket = tickets.some(
  ticket => 
    ticket.price == null ||
  ticket.quantity  == null ||
  ticket.price <= 0 ||
  ticket.quantity <= 0
);

if (invalidTicket) {
  return res.status(400).json({
    message: " All paid events must have  valid ticket price and quantity"
  });
}

  const totalTickets = tickets.reduce(
  (sum, ticket) => sum + ticket.quantity, 0
);

if (totalTickets !== Number(capacity)) {
  return res.status(400).json({
    message: "Total tickets must be equal to capacity"
  });
}
 }

const eventDate = new Date(date);
if (eventDate < new Date()) {
  return res.status(400).json({
    message: "Event date cannot be in the past"
  });
}


const newEvent = await Event.create({
  organizerId,
  eventType,
  title,
  description,
  category,
  location,
  capacity,
  tickets: tickets || [],
  date,
  time,
  bannerImage
});

res.status(201).json({
  message: "Event created successfully",
  event: newEvent
});

  } catch (error) {
console.log("Error creating event:", error.message);

res.status(500).json({
  message: error.message
});
    }

    if (user.role !== "organizer") {
      return res.status(403).json({
        message: "Only organizers can create events",
      });
    }

    if (
      !organizerId ||
      !title ||
      !description ||
      !category ||
      !location ||
      !capacity ||
      !date ||
      !time ||
      !bannerImage
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    if (eventType === "Paid" && (!tickets.price || tickets.price <= 0)) {
      return res.status(400).json({
        message: "Paid events must have a valid ticket price",
      });
    }

    const totalTickets = tickets.reduce(
      (sum, tickets) => sum + tickets.quantity,
      0,
    );

    if (totalTickets !== capacity) {
      return res.status(404).json({
        message: "Total tickets must be equal to capacity",
      });
    }

    const newEvent = await Event.create({
      organizerId,
      eventType,
      title,
      description,
      category,
      location,
      capacity,
      tickets,
      date,
      time,
      bannerImage,
    });

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.log("Error creating event:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
}

export const getAllEvents = async (req, res) => {
  try {
    const { search, category, location, eventType, status } = req.query;

    const filter = {};

    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = location;
    }

    if (eventType) {
      filter.eventType = eventType;
    }

<<<<<<< HEAD
    if (status) {
      filter.status = status;
    }
=======
if (location) {
  filter.location = {
    $regex: location,
    $options: "i"
};
}
>>>>>>> c3aa3b41b85db72cd56404a4d5a10105bc9f2b16

    const events = await Event.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      count: events.length,
      events,
    });
  } catch (error) {
    console.log("Error fetching events:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSingleEvent = async (req, res) => {
  try {
    const { id } = req.params;

<<<<<<< HEAD
    const event = await Event.findById(id);
=======
if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({
    message: "Invalid event id"
  });
}

const event = await Event.findById(id);

if (!event) { 
    return res.status(404).json({
        message: "Event not found"
    });
}
res.status(200).json(event);

    } catch (error) {
console.log("Error fetching event:", error);

res.status(500).json({
    message: error.message
});
>>>>>>> c3aa3b41b85db72cd56404a4d5a10105bc9f2b16

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    res.status(200).json(event);
  } catch (error) {
    console.log("Error fetching event:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = Object.keys(req.body);

    const allowedUpdates = [
      "title",
      "description",
      "category",
      "location",
      "capacity",
      "tickets",
      "date",
      "time",
      "bannerImage",
    ];

    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidOperation) {
      return res.status(400).json({
        message: "Invalid update field",
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only update events you created",
      });
    }
<<<<<<< HEAD
    if (req.body.tickets || req.capacity) {
      const event = await Event.findById(id);

      const capacity = req.body.capacity || event.capacity;

      const tickets = req.body.tickets || event.tickets;
=======
if (req.body.tickets !== undefined ||
   req.body.capacity !== undefined) {

  const capacity = 
  req.body.capacity !== undefined 
  ? req.body.capacity : event.capacity;

  const tickets = 
  req.body.tickets !== undefined 
  ? req.body.tickets : event.tickets;

>>>>>>> c3aa3b41b85db72cd56404a4d5a10105bc9f2b16

      const totalTickets = tickets.reduce(
        (sum, ticket) => sum + ticket.quantity,
        0,
      );

<<<<<<< HEAD
      if (totalTickets !== capacity) {
        return res.status(404).json({
          message: "Total tickets must be equal to capacity",
        });
=======
  if (totalTickets !== Number(capacity)) {
    return res.status(400).json({
      message: "Total tickets must be equal to capacity"
    });
  }
   }
   
   if (req.body.date){
const eventDate = new Date(req.body.date);

if (eventDate < new Date()) {
  return res.status(400).json({
    message: "Event date cannot be in the past"
  });
}
   }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
>>>>>>> c3aa3b41b85db72cd56404a4d5a10105bc9f2b16
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.log("Error updating event:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete events you created",
      });
    }

    await Event.findByIdAndDelete(id);

    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting event:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOrganizerEvents = async (req, res) => {
  try {
    const { organizerId } = req.params;

    const events = await Event.find({
      organizerId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: events.length,
      events,
    });
  } catch (error) {
    console.log("Error fetching organizer events:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

<<<<<<< HEAD
=======

export const getMyEvents = async (req, res) => {
try {
const organizerId = req.user._id;
const events = await Event.find({organizerId}).sort({ createdAt: -1 });
res.status(200).json({
  count: events.length, events
});
} catch(error) {
  res.status(500).json({
    message: error.message
  });
}
}


>>>>>>> c3aa3b41b85db72cd56404a4d5a10105bc9f2b16
export const saveEvent = async (req, res) => {
  try {
<<<<<<< HEAD
    const { userId, eventId } = req.body;
=======

    const userId = req.user._id;
    const { eventId } = req.params
>>>>>>> c3aa3b41b85db72cd56404a4d5a10105bc9f2b16

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
<<<<<<< HEAD
        message: "User not found",
      });
    }

    if (user.role !== "guest") {
      return res.status(403).json({
        message: "Only guests can save events",
      });
    }
=======
      message: "User not found"
      });
    }


>>>>>>> c3aa3b41b85db72cd56404a4d5a10105bc9f2b16

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (user.savedEvents.includes(eventId)) {
      return res.status(400).json({
        message: "Event already saved",
      });
    }

    user.savedEvents.push(eventId);

    await user.save();

    res.status(200).json({
      message: "Event saved successfully",
      savedEvents: user.savedEvents,
    });
  } catch (error) {
    console.log("Error saving event:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const unsaveEvent = async (req, res) => {
  try {
<<<<<<< HEAD
    const { userId, eventId } = req.body;
=======
    const userId = req.user._id;
    const { eventId } = req.params;
>>>>>>> c3aa3b41b85db72cd56404a4d5a10105bc9f2b16

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
<<<<<<< HEAD
        message: "User not found",
=======
       message: "User not found"
      });
    }
    if (!user.savedEvents.some(
      id => id.toString() === eventId
    )) {

      return res.status(404).json({
message: "Event not found in saved events"
>>>>>>> c3aa3b41b85db72cd56404a4d5a10105bc9f2b16
      });
    }

    user.savedEvents = user.savedEvents.filter(
      (id) => id.toString() !== eventId,
    );

    await user.save();

    res.status(200).json({
      message: "Event unsaved successfully",
    });
  } catch (error) {
    console.log("Error removing saved event:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSavedEvents = async (req, res) => {
  try {
<<<<<<< HEAD
    const { userId } = req.params;
=======

    const userId  = req.user._id;
>>>>>>> c3aa3b41b85db72cd56404a4d5a10105bc9f2b16

    const user = await User.findById(userId).populate("savedEvents");

    if (!user) {
      return res.status(404).json({
<<<<<<< HEAD
        message: "User not found",
      });
=======
       message: "User not found"
      })
>>>>>>> c3aa3b41b85db72cd56404a4d5a10105bc9f2b16
    }

    res.status(200).json({
      message: "Saved events fetched successfully",
      count: user.savedEvents.length,
<<<<<<< HEAD
      savedEvents: user.savedEvents,
    });
  } catch (error) {
    console.log("Error fetching saved events:", error);
=======
      savedEvents: user.savedEvents
    })
  } catch (error) {

    console.log("Error fetching saved events:", error)
>>>>>>> c3aa3b41b85db72cd56404a4d5a10105bc9f2b16

    res.status(500).json({
      message: error.message,
    });
  }
<<<<<<< HEAD
=======

>>>>>>> c3aa3b41b85db72cd56404a4d5a10105bc9f2b16
};
