import React, { useState } from "react";
import { useSeatMaps } from "@/hooks/useSeatMaps";
import { useVenues } from "@/hooks/useVenues";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Layout from "@/components/organisms/Layout";
import SeatMapBuilder from "@/components/organisms/SeatMapBuilder";
import FormField from "@/components/molecules/FormField";
import SearchBar from "@/components/molecules/SearchBar";
import Seat from "@/components/molecules/Seat";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import zoneService from "@/services/api/zoneService";
import seatService from "@/services/api/seatService";
import entryExitService from "@/services/api/entryExitService";
import aisleService from "@/services/api/aisleService";
const SeatMapsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMap, setSelectedMap] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMap, setEditingMap] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    venueId: "",
    isTemplate: false,
    zones: [],
    seats: []
  });
  const [saving, setSaving] = useState(false);
  const { seatMaps, loading: mapsLoading, error: mapsError, loadSeatMaps, deleteSeatMap } = useSeatMaps();
  const { venues, loading: venuesLoading } = useVenues();
  const navigate = useNavigate();

  const handleCreateSeatMap = () => {
    setEditingMap(null);
    setFormData({
      name: "",
      venueId: "",
      isTemplate: false,
      zones: [
        { id: 1, name: "General", color: "#10b981", price: 50 },
        { id: 2, name: "VIP", color: "#8b5cf6", price: 100 }
      ],
      seats: []
    });
    setShowModal(true);
  };

  const handleEditSeatMap = (seatMap) => {
    setEditingMap(seatMap);
    setFormData({
      name: seatMap.name || "",
      venueId: seatMap.venueId || "",
      isTemplate: seatMap.isTemplate || false,
      zones: seatMap.zones || [],
      seats: seatMap.seats || []
    });
    setShowModal(true);
  };

  const handleDeleteSeatMap = async (seatMap) => {
    if (window.confirm(`Are you sure you want to delete "${seatMap.name}"?`)) {
      try {
        await deleteSeatMap(seatMap.Id);
        toast.success("Seat map deleted successfully");
        if (selectedMap && selectedMap.Id === seatMap.Id) {
          setSelectedMap(null);
        }
      } catch (err) {
        toast.error("Failed to delete seat map");
      }
    }
  };

  const handleViewSeatMap = (seatMap) => {
    setSelectedMap(seatMap);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
const handleSeatMapBuilderSave = async (seatMapData) => {
    setFormData(prev => ({
      ...prev,
      zones: seatMapData.zones,
      seats: seatMapData.seats,
      entryExits: seatMapData.entryExits || [],
      aisles: seatMapData.aisles || []
    }));
  };
const handleSave = async () => {
    if (!formData.name) {
      toast.error("Please enter a seat map name");
      return;
    }

    setSaving(true);
    try {
      const seatMapData = {
        name: formData.name,
        venueId: formData.venueId || null,
        isTemplate: formData.isTemplate,
        dimensions: "800x600" // Default dimensions
      };

      let savedSeatMap;
      if (editingMap) {
        const seatMapService = (await import("@/services/api/seatMapService")).default;
        savedSeatMap = await seatMapService.update(editingMap.Id, seatMapData);
        
// Update zones, seats, entry/exits, and aisles
        await saveZonesAndSeats(editingMap.Id, formData.zones, formData.seats, formData.entryExits, formData.aisles);
        
        toast.success("Seat map updated successfully");
      } else {
        const seatMapService = (await import("@/services/api/seatMapService")).default;
        savedSeatMap = await seatMapService.create(seatMapData);
        
if (savedSeatMap) {
          // Save zones, seats, entry/exits, and aisles with the new seat map ID
          await saveZonesAndSeats(savedSeatMap.Id, formData.zones, formData.seats, formData.entryExits, formData.aisles);
        }
        
        toast.success("Seat map created successfully");
      }

      setShowModal(false);
      loadSeatMaps();
    } catch (err) {
      toast.error(editingMap ? "Failed to update seat map" : "Failed to create seat map");
    } finally {
      setSaving(false);
    }
  };

const saveZonesAndSeats = async (mapId, zones, seats, entryExits = [], aisles = []) => {
    try {
      // Delete existing data for this map
      await Promise.all([
        zoneService.deleteByMapId(mapId),
        seatService.deleteByMapId(mapId),
        entryExitService.deleteByVenueId(mapId),
        aisleService.deleteByMapId(mapId)
      ]);

      // Create new zones
      const zonePromises = zones.map(zone => 
        zoneService.create({
          name: zone.name,
          mapId: mapId,
          price: zone.price,
          color: zone.color
        })
      );
      
      const savedZones = await Promise.all(zonePromises);

      // Create mapping from old zone ids to new zone ids
      const zoneIdMap = {};
      zones.forEach((zone, index) => {
        if (savedZones[index]) {
          zoneIdMap[zone.id] = savedZones[index].Id;
        }
      });

      // Create new seats with updated zone references
      const seatsWithUpdatedZones = seats.map(seat => ({
        ...seat,
        mapId: mapId,
        zoneId: zoneIdMap[seat.zoneId] || savedZones[0]?.Id || null
      }));

      if (seatsWithUpdatedZones.length > 0) {
        await seatService.createBulk(seatsWithUpdatedZones);
      }

      // Create entry/exits
      const entryExitPromises = entryExits.map(entryExit => 
        entryExitService.create({
          Name: entryExit.name,
          venue_id: mapId,
          x: entryExit.x,
          y: entryExit.y,
          capacity: entryExit.capacity
        })
      );
      
      if (entryExitPromises.length > 0) {
        await Promise.all(entryExitPromises);
      }

      // Create aisles
      const aislePromises = aisles.map(aisle => 
        aisleService.create({
          Name: aisle.name,
          map_id: mapId,
          x: aisle.x,
          y: aisle.y,
          width: aisle.width,
          length: aisle.length
        })
      );
      
      if (aislePromises.length > 0) {
        await Promise.all(aislePromises);
      }
    } catch (error) {
      console.error("Error saving seat map data:", error);
      throw error;
    }
  };

  const getVenueName = (venueId) => {
    const venue = venues.find(v => v.Id === venueId);
    return venue ? venue.name : "Unknown Venue";
  };
const filteredSeatMaps = seatMaps.filter(map =>
    map.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getVenueName(map.venueId)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (mapsLoading || venuesLoading) {
    return <Layout title="Seat Maps"><Loading type="seatMap" /></Layout>;
  }
  
  if (mapsError) {
    return <Layout title="Seat Maps"><Error message={mapsError} onRetry={loadSeatMaps} /></Layout>;
  }

  if (selectedMap) {
    return (
      <Layout title={`Seat Map: ${selectedMap.name}`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={() => setSelectedMap(null)}
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
              Back to Maps
            </Button>
            <Button
              variant="primary"
              onClick={() => handleEditSeatMap(selectedMap)}
            >
              <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
              Edit Map
            </Button>
          </div>
          <SeatMapBuilder seatMap={selectedMap} readOnly={true} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Seat Maps" subtitle="Create and manage seat layouts for your venues">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search seat maps..."
            className="w-full sm:w-64"
          />
          <Button variant="primary" onClick={handleCreateSeatMap}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Create Seat Map
          </Button>
        </div>

        {/* Seat Maps Grid */}
        {filteredSeatMaps.length === 0 ? (
          <Empty
            title="No seat maps found"
            description={searchTerm ? 
              "Try adjusting your search criteria." : 
              "Create your first seat map to enable seat selection for events."
            }
            actionLabel="Create Seat Map"
            onAction={handleCreateSeatMap}
            icon="Grid3X3"
          />
        ) : (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeatMaps.map((seatMap) => (
              <Card key={seatMap.Id} className="p-6 hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-surface to-surface-light border-gray-700 hover:border-gray-600 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-primary-300 transition-colors">
                      {seatMap.name}
                    </h3>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <ApperIcon name="Building" className="w-4 h-4 mr-2 text-blue-400" />
                        <span className="font-medium">
                          {seatMap.venueId ? getVenueName(seatMap.venueId) : "Template"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <ApperIcon name="Grid3X3" className="w-4 h-4 mr-2 text-green-400" />
                        <span className="font-medium">{seatMap.totalSeats || 0} seats</span>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <ApperIcon name="MapPin" className="w-4 h-4 mr-2 text-purple-400" />
                        <span className="font-medium">{seatMap.totalZones || 0} zones</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {seatMap.isTemplate && (
                        <Badge variant="accent" className="text-xs font-medium">
                          <ApperIcon name="Template" className="w-3 h-3 mr-1" />
                          Template
                        </Badge>
                      )}
                      {seatMap.dimensions && (
                        <Badge variant="secondary" className="text-xs font-medium">
                          <ApperIcon name="Maximize" className="w-3 h-3 mr-1" />
                          {seatMap.dimensions}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => handleViewSeatMap(seatMap)}
                    className="flex-1 transform hover:scale-105 transition-all duration-200"
                  >
                    <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleEditSeatMap(seatMap)}
                    className="transform hover:scale-105 transition-all duration-200"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDeleteSeatMap(seatMap)}
                    className="transform hover:scale-105 transition-all duration-200"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
{filteredSeatMaps.length > 0 && (
          <div className="bg-gradient-to-r from-surface via-surface-light to-surface rounded-xl p-6 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-3xl font-bold text-white mb-2">{filteredSeatMaps.length}</p>
                <p className="text-sm text-gray-400 font-medium">Total Maps</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-3xl font-bold text-primary-400 mb-2">
                  {filteredSeatMaps.reduce((sum, map) => sum + (map.totalSeats || 0), 0)}
                </p>
                <p className="text-sm text-gray-400 font-medium">Total Seats</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-3xl font-bold text-accent-400 mb-2">
                  {filteredSeatMaps.filter(map => map.isTemplate).length}
                </p>
                <p className="text-sm text-gray-400 font-medium">Templates</p>
              </div>
            </div>
          </div>
        )}
        {/* Seat Map Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingMap ? "Edit Seat Map" : "Create Seat Map"}
                  </h2>
                  <Button variant="ghost" onClick={() => setShowModal(false)}>
                    <ApperIcon name="X" className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Seat Map Name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Enter seat map name"
                      required
                    />
                    <FormField
                      type="select"
                      label="Venue"
                      name="venueId"
                      value={formData.venueId}
                      onChange={handleFormChange}
                      options={venues.map(venue => ({
                        value: venue.Id,
                        label: venue.name
                      }))}
                      placeholder="Select venue (optional)"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isTemplate"
                      checked={formData.isTemplate}
                      onChange={(e) => handleFormChange("isTemplate", e.target.checked)}
                      className="w-4 h-4 text-primary-600 bg-surface border-gray-600 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="isTemplate" className="text-sm font-medium text-gray-300">
                      Create as template (can be reused for multiple venues)
                    </label>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Seat Map Builder</h3>
                    <SeatMapBuilder
                      seatMap={formData}
                      onSave={handleSeatMapBuilderSave}
                      readOnly={false}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    )}
                    {editingMap ? "Update Seat Map" : "Create Seat Map"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SeatMapsPage;