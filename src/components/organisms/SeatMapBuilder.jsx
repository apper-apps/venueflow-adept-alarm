import React, { useState, useRef, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Seat from "@/components/molecules/Seat";
import zoneService from "@/services/api/zoneService";
import seatService from "@/services/api/seatService";

const SeatMapBuilder = ({ seatMap, onSave, readOnly = false }) => {
  const [selectedTool, setSelectedTool] = useState("seat");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [zones, setZones] = useState([]);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentZone, setCurrentZone] = useState(null);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [zoneFormData, setZoneFormData] = useState({
    name: "",
    color: "#10b981",
    price: 50
  });
  const canvasRef = useRef(null);

  // Load zones and seats when seatMap changes
  useEffect(() => {
    if (seatMap && seatMap.Id) {
      loadZonesAndSeats();
    } else {
      // Set default zones for new seat maps
      setZones([
        { id: 1, name: "General", color: "#10b981", price: 50 },
        { id: 2, name: "VIP", color: "#8b5cf6", price: 100 }
      ]);
      setCurrentZone(1);
    }
  }, [seatMap]);

  const loadZonesAndSeats = async () => {
    setLoading(true);
    try {
      const [zonesData, seatsData] = await Promise.all([
        zoneService.getByMapId(seatMap.Id),
        seatService.getByMapId(seatMap.Id)
      ]);
      
      setZones(zonesData);
      setSeats(seatsData);
      
      if (zonesData.length > 0) {
        setCurrentZone(zonesData[0].id);
      }
    } catch (error) {
      console.error("Error loading zones and seats:", error);
    } finally {
      setLoading(false);
    }
  };

const tools = [
    { id: "seat", name: "Add Seat", icon: "Square" },
    { id: "row", name: "Add Row", icon: "Grid3X3" },
    { id: "zone", name: "Zone Paint", icon: "Palette" },
    { id: "select", name: "Select", icon: "MousePointer" },
    { id: "delete", name: "Delete", icon: "Trash2" }
  ];
  const handleCanvasClick = (e) => {
    if (readOnly) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

if (selectedTool === "seat" && currentZone) {
      const newSeat = {
        id: Date.now(),
        x: Math.round(x / 30) * 30,
        y: Math.round(y / 30) * 30,
        row: `R${Math.floor(y / 30) + 1}`,
        number: seats.filter(s => s.row === `R${Math.floor(y / 30) + 1}`).length + 1,
        zoneId: currentZone,
        mapId: seatMap?.Id,
        type: zones.find(z => z.id === currentZone)?.name.toLowerCase().includes("vip") ? "vip" : "regular",
        status: "available"
      };
      setSeats([...seats, newSeat]);
    }
  };

const handleSeatClick = (seat) => {
    if (selectedTool === "select") {
      setSelectedSeats(prev => 
        prev.includes(seat.id) 
          ? prev.filter(id => id !== seat.id)
          : [...prev, seat.id]
      );
    } else if (selectedTool === "delete") {
      setSeats(prev => prev.filter(s => s.id !== seat.id));
    } else if (selectedTool === "zone" && currentZone) {
      // Update seat's zone assignment
      setSeats(prev => prev.map(s => 
        s.id === seat.id 
          ? { ...s, zoneId: currentZone }
          : s
      ));
    }
  };
const generateRow = () => {
    if (readOnly || !currentZone) return;

    const rowNumber = Math.max(...seats.map(s => parseInt(s.row.substring(1))), 0) + 1;
    const newSeats = [];
    
    for (let i = 1; i <= 10; i++) {
      newSeats.push({
        id: Date.now() + i,
        x: i * 40,
        y: rowNumber * 40,
        row: `R${rowNumber}`,
        number: i,
        zoneId: currentZone,
        mapId: seatMap?.Id,
        type: zones.find(z => z.id === currentZone)?.name.toLowerCase().includes("vip") ? "vip" : "regular",
        status: "available"
      });
    }
    
    setSeats([...seats, ...newSeats]);
  };

const handleCreateZone = () => {
    setEditingZone(null);
    setZoneFormData({
      name: "",
      color: "#10b981",
      price: 50
    });
    setShowZoneModal(true);
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setZoneFormData({
      name: zone.name,
      color: zone.color,
      price: zone.price
    });
    setShowZoneModal(true);
  };

  const handleDeleteZone = (zoneId) => {
    if (window.confirm("Are you sure you want to delete this zone? All seats in this zone will be reassigned to the first available zone.")) {
      const remainingZones = zones.filter(z => z.id !== zoneId);
      const fallbackZoneId = remainingZones[0]?.id || null;
      
      // Reassign seats to fallback zone
      setSeats(prev => prev.map(seat => 
        seat.zoneId === zoneId 
          ? { ...seat, zoneId: fallbackZoneId }
          : seat
      ));
      
      setZones(remainingZones);
      
      if (currentZone === zoneId) {
        setCurrentZone(fallbackZoneId);
      }
    }
  };

  const handleZoneFormSubmit = () => {
    if (!zoneFormData.name.trim()) {
      alert("Please enter a zone name");
      return;
    }

    if (editingZone) {
      // Update existing zone
      setZones(prev => prev.map(zone => 
        zone.id === editingZone.id 
          ? { ...zone, ...zoneFormData }
          : zone
      ));
    } else {
      // Create new zone
      const newZone = {
        id: Date.now(),
        ...zoneFormData
      };
      setZones(prev => [...prev, newZone]);
      setCurrentZone(newZone.id);
    }
    
    setShowZoneModal(false);
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave({ zones, seats });
    }
  };
  return (
    <div className="space-y-6">
      {!readOnly && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Seat Map Builder</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tools</label>
              <div className="space-y-2">
                {tools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedTool(tool.id)}
                    className="w-full justify-start"
                  >
                    <ApperIcon name={tool.icon} className="w-4 h-4 mr-2" />
                    {tool.name}
                  </Button>
                ))}
              </div>
            </div>

<div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Zone Management</label>
              <div className="space-y-2 mb-4">
                {zones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: zone.color }}
                      ></div>
                      <span className="text-sm text-white">{zone.name}</span>
                      <span className="text-xs text-gray-400">${zone.price}</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditZone(zone)}
                        className="p-1"
                      >
                        <ApperIcon name="Edit2" className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteZone(zone.id)}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <ApperIcon name="Trash2" className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="accent"
                size="sm"
                onClick={handleCreateZone}
                className="w-full mb-4"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Zone
              </Button>
              
              <label className="block text-sm font-medium text-gray-300 mb-2">Current Zone</label>
              <Select
                value={currentZone || ""}
                onChange={(e) => setCurrentZone(parseInt(e.target.value))}
                disabled={zones.length === 0}
              >
                {zones.length === 0 ? (
                  <option value="">No zones available</option>
                ) : (
                  zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} - ${zone.price}
                    </option>
                  ))
                )}
              </Select>
              <Button
                variant="accent"
                size="sm"
                onClick={generateRow}
                className="w-full mt-2"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Generate Row
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Actions</label>
              <div className="space-y-2">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  className="w-full"
                >
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                  Save Map
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setSeats([])}
                  className="w-full"
                >
                  <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

<Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Seat Map Preview</h3>
          <div className="flex items-center space-x-4 text-sm">
            {zones.map((zone) => (
              <div key={zone.id} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded mr-2" 
                  style={{ backgroundColor: zone.color }}
                ></div>
                <span className="text-gray-400">{zone.name} (${zone.price})</span>
              </div>
            ))}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-gray-400">Occupied</span>
            </div>
          </div>
        </div>

<div
          ref={canvasRef}
          className="relative w-full h-96 bg-gray-900 border border-gray-600 rounded-lg overflow-auto cursor-crosshair"
          onClick={handleCanvasClick}
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ApperIcon name="Loader2" className="w-8 h-8 mx-auto mb-2 animate-spin" />
                <p>Loading seat map...</p>
              </div>
            </div>
          ) : (
            <>
{seats.map((seat) => {
                const zone = zones.find(z => z.id === seat.zoneId);
                const seatWithZone = {
                  ...seat,
                  zone: zone?.name || "Unknown Zone",
                  price: zone?.price || 0,
                  zoneColor: zone?.color || "#10b981"
                };
                
                return (
                  <div
                    key={seat.id}
                    className="absolute"
                    style={{ left: seat.x, top: seat.y }}
                  >
                    <Seat
                      seat={seatWithZone}
                      isSelected={selectedSeats.includes(seat.id)}
                      onSelect={handleSeatClick}
                      disabled={readOnly}
                    />
                  </div>
                );
              })}
              
              {seats.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <ApperIcon name="Grid3X3" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Click to add seats or use tools above</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-400">
          <p>Total Seats: {seats.length}</p>
          <p>Selected: {selectedSeats.length}</p>
        </div>
</Card>

      {/* Zone Management Modal */}
      {showZoneModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingZone ? "Edit Zone" : "Create Zone"}
              </h3>
              <Button variant="ghost" onClick={() => setShowZoneModal(false)}>
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Zone Name
                </label>
                <Input
                  value={zoneFormData.name}
                  onChange={(e) => setZoneFormData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  placeholder="Enter zone name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Zone Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={zoneFormData.color}
                    onChange={(e) => setZoneFormData(prev => ({
                      ...prev,
                      color: e.target.value
                    }))}
                    className="w-12 h-10 border border-gray-600 rounded cursor-pointer"
                  />
                  <Input
                    value={zoneFormData.color}
                    onChange={(e) => setZoneFormData(prev => ({
                      ...prev,
                      color: e.target.value
                    }))}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Base Price ($)
                </label>
                <Input
                  type="number"
                  value={zoneFormData.price}
                  onChange={(e) => setZoneFormData(prev => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0
                  }))}
                  placeholder="Enter base price"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <Button 
                variant="secondary" 
                onClick={() => setShowZoneModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleZoneFormSubmit}
              >
                {editingZone ? "Update Zone" : "Create Zone"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SeatMapBuilder;