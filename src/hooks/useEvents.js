import { useState, useEffect } from "react";
import eventService from "@/services/api/eventService";

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await eventService.getAll();
      setEvents(data);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const createEvent = async (eventData) => {
    try {
      const newEvent = await eventService.create(eventData);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      throw new Error("Failed to create event");
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      const updatedEvent = await eventService.update(id, eventData);
      if (updatedEvent) {
        setEvents(prev => prev.map(event => 
          event.Id === id ? updatedEvent : event
        ));
        return updatedEvent;
      }
    } catch (err) {
      throw new Error("Failed to update event");
    }
  };

  const deleteEvent = async (id) => {
    try {
      await eventService.delete(id);
      setEvents(prev => prev.filter(event => event.Id !== id));
    } catch (err) {
      throw new Error("Failed to delete event");
    }
  };

  return {
    events,
    loading,
    error,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
};