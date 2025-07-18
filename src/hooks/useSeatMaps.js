import { useState, useEffect } from "react";
import seatMapService from "@/services/api/seatMapService";

export const useSeatMaps = () => {
  const [seatMaps, setSeatMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSeatMaps = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await seatMapService.getAll();
      setSeatMaps(data);
    } catch (err) {
      setError("Failed to load seat maps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeatMaps();
  }, []);

  const createSeatMap = async (seatMapData) => {
    try {
      const newSeatMap = await seatMapService.create(seatMapData);
      setSeatMaps(prev => [...prev, newSeatMap]);
      return newSeatMap;
    } catch (err) {
      throw new Error("Failed to create seat map");
    }
  };

  const updateSeatMap = async (id, seatMapData) => {
    try {
      const updatedSeatMap = await seatMapService.update(id, seatMapData);
      if (updatedSeatMap) {
        setSeatMaps(prev => prev.map(map => 
          map.Id === id ? updatedSeatMap : map
        ));
        return updatedSeatMap;
      }
    } catch (err) {
      throw new Error("Failed to update seat map");
    }
  };

  const deleteSeatMap = async (id) => {
    try {
      await seatMapService.delete(id);
      setSeatMaps(prev => prev.filter(map => map.Id !== id));
    } catch (err) {
      throw new Error("Failed to delete seat map");
    }
  };

  return {
    seatMaps,
    loading,
    error,
    loadSeatMaps,
    createSeatMap,
    updateSeatMap,
    deleteSeatMap
  };
};