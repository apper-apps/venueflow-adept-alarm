import { useState, useEffect } from "react";
import venueService from "@/services/api/venueService";

export const useVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVenues = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await venueService.getAll();
      setVenues(data);
    } catch (err) {
      setError("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVenues();
  }, []);

  const createVenue = async (venueData) => {
    try {
      const newVenue = await venueService.create(venueData);
      setVenues(prev => [...prev, newVenue]);
      return newVenue;
    } catch (err) {
      throw new Error("Failed to create venue");
    }
  };

  const updateVenue = async (id, venueData) => {
    try {
      const updatedVenue = await venueService.update(id, venueData);
      if (updatedVenue) {
        setVenues(prev => prev.map(venue => 
          venue.Id === id ? updatedVenue : venue
        ));
        return updatedVenue;
      }
    } catch (err) {
      throw new Error("Failed to update venue");
    }
  };

  const deleteVenue = async (id) => {
    try {
      await venueService.delete(id);
      setVenues(prev => prev.filter(venue => venue.Id !== id));
    } catch (err) {
      throw new Error("Failed to delete venue");
    }
  };

  return {
    venues,
    loading,
    error,
    loadVenues,
    createVenue,
    updateVenue,
    deleteVenue
  };
};