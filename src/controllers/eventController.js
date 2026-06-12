
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
        message: "User not found",
      });
    }

    if (user.role !== "organizer") {
      return res.status(403).json({
        message: "Only organizers can create events",
      });
    }

    // Free events are allowed without ticket tiers. Paid events must have valid tickets.
    // The event capacity must match total ticket quantities for paid events.

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
        message: "All required fields must be provided",
      });
    }

    if (eventType === "Paid") {
      if (!tickets || tickets.length === 0) {
        return res.status(400).json({
          message: "Paid events must have tickets",
        });
      }

      const invalidTicket = tickets.some(
        (ticket) =>
          ticket.price == null ||
          ticket.quantity == null ||
          ticket.price <= 0 ||
          ticket.quantity <= 0,
      );

      if (invalidTicket) {
        return res.status(400).json({
          message:
            "All paid events must have valid ticket price and quantity",
        });
      }

      const totalTickets = tickets.reduce(
        (sum, ticket) => sum + ticket.quantity,
        0,
      );

      if (totalTickets !== Number(capacity)) {
        return res.status(400).json({
          message: "Total tickets must be equal to capacity",
        });
      }
    }

    const eventDate = new Date(date);

    if (eventDate < new Date()) {
      return res.status(400).json({
        message: "Event date cannot be in the past",
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
};

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

    if (eventType) {
      filter.eventType = eventType;
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid event id",
      });
    }

    const event = await Event.findById(id);

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

    // When tickets or capacity are updated, validate the new totals.
    if (req.body.tickets !== undefined || req.body.capacity !== undefined) {
      const capacity =
        req.body.capacity !== undefined ? req.body.capacity : event.capacity;

      const tickets =
        req.body.tickets !== undefined ? req.body.tickets : event.tickets;

      const totalTickets = tickets.reduce(
        (sum, ticket) => sum + ticket.quantity,
        0,
      );

      if (totalTickets !== Number(capacity)) {
        return res.status(400).json({
          message: "Total tickets must be equal to capacity",
        });
      }
    }

    if (req.body.date) {
      const eventDate = new Date(req.body.date);

      if (eventDate < new Date()) {
        return res.status(400).json({
          message: "Event date cannot be in the past",
        });
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


export const saveEvent = async (req, res) => {
  try {

    const userId = req.user._id;
    const { eventId } = req.params

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
      message: "User not found"
      });
    }



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
    const userId = req.user._id;
    const { eventId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
       message: "User not found"
      });
    }
    if (!user.savedEvents.some(
      id => id.toString() === eventId
    )) {

      return res.status(404).json({
message: "Event not found in saved events"
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

    const userId  = req.user._id;

    const user = await User.findById(userId).populate("savedEvents");

    if (!user) {
      return res.status(404).json({
       message: "User not found"
      })
    }

    res.status(200).json({
      message: "Saved events fetched successfully",
      count: user.savedEvents.length,
      savedEvents: user.savedEvents
    })
  } catch (error) {

    console.log("Error fetching saved events:", error)

    res.status(500).json({
      message: error.message,
    });
  }
};
