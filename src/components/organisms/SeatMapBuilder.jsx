import React, { useEffect, useRef, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Seat from "@/components/molecules/Seat";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import zoneService from "@/services/api/zoneService";
import seatService from "@/services/api/seatService";
import aisleService from "@/services/api/aisleService";
import entryExitService from "@/services/api/entryExitService";
const SeatMapBuilder = ({ seatMap, onSave, readOnly = false }) => {
const [selectedTool, setSelectedTool] = useState("seat");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [zones, setZones] = useState([]);
  const [seats, setSeats] = useState([]);
  const [entryExits, setEntryExits] = useState([]);
  const [aisles, setAisles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentZone, setCurrentZone] = useState(null);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [showEntryExitModal, setShowEntryExitModal] = useState(false);
  const [editingEntryExit, setEditingEntryExit] = useState(null);
  const [showAisleModal, setShowAisleModal] = useState(false);
  const [editingAisle, setEditingAisle] = useState(null);
  const [zoneFormData, setZoneFormData] = useState({
    name: "",
    color: "#10b981",
    price: 50
  });
  const [entryExitFormData, setEntryExitFormData] = useState({
    name: "",
    capacity: 100,
    x: 0,
    y: 0
  });
  const [aisleFormData, setAisleFormData] = useState({
    name: "",
    width: 20,
    length: 100,
    x: 0,
    y: 0
  });
  const canvasRef = useRef(null);

// Load zones, seats, entry/exits, and aisles when seatMap changes
  useEffect(() => {
    if (seatMap && seatMap.Id) {
      loadSeatMapData();
    } else {
      // Set default zones for new seat maps
      setZones([
        { id: 1, name: "General", color: "#10b981", price: 50 },
        { id: 2, name: "VIP", color: "#8b5cf6", price: 100 }
      ]);
      setCurrentZone(1);
      setEntryExits([]);
      setAisles([]);
    }
  }, [seatMap]);

const loadSeatMapData = async () => {
    setLoading(true);
    try {
      const [zonesData, seatsData, entryExitsData, aislesData] = await Promise.all([
        zoneService.getByMapId(seatMap.Id),
        seatService.getByMapId(seatMap.Id),
        entryExitService.getByVenueId(seatMap.venueId || seatMap.Id),
        aisleService.getByMapId(seatMap.Id)
      ]);
      
      setZones(zonesData);
      setSeats(seatsData);
      setEntryExits(entryExitsData);
      setAisles(aislesData);
      
      if (zonesData.length > 0) {
        setCurrentZone(zonesData[0].id);
      }
    } catch (error) {
      console.error("Error loading seat map data:", error);
    } finally {
      setLoading(false);
    }
  };

const tools = [
    { id: "seat", name: "Add Seat", icon: "Square" },
    { id: "row", name: "Add Row", icon: "Grid3X3" },
    { id: "zone", name: "Zone Paint", icon: "Palette" },
    { id: "entry", name: "Entry/Exit", icon: "DoorOpen" },
    { id: "aisle", name: "Aisle", icon: "Route" },
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
    } else if (selectedTool === "entry") {
      setEntryExitFormData({
        name: `Entry ${entryExits.length + 1}`,
        capacity: 100,
        x: Math.round(x / 30) * 30,
        y: Math.round(y / 30) * 30
      });
      setEditingEntryExit(null);
      setShowEntryExitModal(true);
    } else if (selectedTool === "aisle") {
      setAisleFormData({
        name: `Aisle ${aisles.length + 1}`,
        width: 20,
        length: 100,
        x: Math.round(x / 30) * 30,
        y: Math.round(y / 30) * 30
      });
      setEditingAisle(null);
      setShowAisleModal(true);
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

  const handleEntryExitClick = (entryExit) => {
    if (selectedTool === "delete") {
      setEntryExits(prev => prev.filter(e => e.id !== entryExit.id));
    } else if (selectedTool === "select") {
      setEditingEntryExit(entryExit);
      setEntryExitFormData({
        name: entryExit.name || entryExit.Name,
        capacity: entryExit.capacity,
        x: entryExit.x,
        y: entryExit.y
      });
      setShowEntryExitModal(true);
    }
  };

  const handleAisleClick = (aisle) => {
    if (selectedTool === "delete") {
      setAisles(prev => prev.filter(a => a.id !== aisle.id));
    } else if (selectedTool === "select") {
      setEditingAisle(aisle);
      setAisleFormData({
        name: aisle.name || aisle.Name,
        width: aisle.width,
        length: aisle.length,
        x: aisle.x,
        y: aisle.y
      });
      setShowAisleModal(true);
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
  const handleEntryExitFormSubmit = async () => {
    if (!entryExitFormData.name.trim()) {
      alert("Please enter an entry/exit name");
      return;
    }

    if (editingEntryExit) {
      // Update existing entry/exit
      setEntryExits(prev => prev.map(entryExit => 
        entryExit.id === editingEntryExit.id 
          ? { ...entryExit, ...entryExitFormData }
          : entryExit
      ));
    } else {
      // Create new entry/exit
      const newEntryExit = {
        id: Date.now(),
        ...entryExitFormData
      };
      setEntryExits(prev => [...prev, newEntryExit]);
    }
    
    setShowEntryExitModal(false);
  };

  const handleAisleFormSubmit = async () => {
    if (!aisleFormData.name.trim()) {
      alert("Please enter an aisle name");
      return;
    }

    if (editingAisle) {
      // Update existing aisle
      setAisles(prev => prev.map(aisle => 
        aisle.id === editingAisle.id 
          ? { ...aisle, ...aisleFormData }
          : aisle
      ));
    } else {
      // Create new aisle
      const newAisle = {
        id: Date.now(),
        ...aisleFormData
      };
      setAisles(prev => [...prev, newAisle]);
    }
    
    setShowAisleModal(false);
  };

const handleSave = async () => {
    if (onSave) {
      await onSave({ zones, seats, entryExits, aisles });
    }
  };

  const handleExportJSON = () => {
    try {
      // Create comprehensive export data structure for analytics
      const exportData = {
        metadata: {
          seatMapId: seatMap?.Id || null,
          seatMapName: seatMap?.name || 'Untitled Seat Map',
          exportDate: new Date().toISOString(),
          exportVersion: '1.0',
          totalSeats: seats.length,
          totalZones: zones.length,
          dimensions: seatMap?.dimensions || "800x600"
        },
        zones: zones.map(zone => ({
          id: zone.id,
          name: zone.name,
          color: zone.color,
          price: zone.price,
          seatCount: seats.filter(seat => seat.zoneId === zone.id).length
        })),
        seats: seats.map(seat => {
          const zone = zones.find(z => z.id === seat.zoneId);
          return {
            id: seat.id,
            row: seat.row,
            number: seat.number,
            position: {
              x: seat.x,
              y: seat.y
            },
            zone: {
              id: seat.zoneId,
              name: zone?.name || 'Unknown Zone',
              color: zone?.color || '#10b981',
              price: zone?.price || 0
            },
            type: seat.type,
            status: seat.status,
            mapId: seat.mapId
          };
        }),
        analytics: {
          capacityByZone: zones.reduce((acc, zone) => {
            acc[zone.name] = seats.filter(seat => seat.zoneId === zone.id).length;
            return acc;
          }, {}),
          priceDistribution: zones.reduce((acc, zone) => {
            const zoneSeats = seats.filter(seat => seat.zoneId === zone.id).length;
            acc[zone.price] = (acc[zone.price] || 0) + zoneSeats;
            return acc;
          }, {}),
          totalCapacity: seats.length,
          averagePrice: zones.length > 0 ? 
            zones.reduce((sum, zone) => {
              const zoneSeats = seats.filter(seat => seat.zoneId === zone.id).length;
              return sum + (zone.price * zoneSeats);
            }, 0) / seats.length : 0,
          seatTypes: seats.reduce((acc, seat) => {
            acc[seat.type] = (acc[seat.type] || 0) + 1;
            return acc;
          }, {}),
          zoneUtilization: zones.map(zone => ({
            zoneName: zone.name,
            capacity: seats.filter(seat => seat.zoneId === zone.id).length,
            pricePoint: zone.price,
            utilizationRate: seats.filter(seat => seat.zoneId === zone.id && seat.status === 'occupied').length / 
              Math.max(seats.filter(seat => seat.zoneId === zone.id).length, 1)
          }))
        }
      };

      // Create and trigger download
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `seat_map_${seatMap?.name || 'export'}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
URL.revokeObjectURL(url);

      console.log('Seat map data exported successfully for analytics');
    } catch (error) {
      console.error('Error exporting seat map data:', error);
      alert('Failed to export seat map data');
    }
  };
return (
    <div className="space-y-6">
      {!readOnly && (
        <Card className="p-6 bg-gradient-to-br from-surface to-surface-light border-gray-700 transition-all duration-300">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <ApperIcon name="Hammer" className="w-5 h-5 mr-2 text-primary-400" />
            Seat Map Builder
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <ApperIcon name="Wrench" className="w-4 h-4 mr-2" />
                Tools
              </label>
              <div className="grid grid-cols-1 gap-2">
                {tools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedTool(tool.id)}
                    className={`w-full justify-start transition-all duration-200 transform hover:scale-105 ${
                      selectedTool === tool.id 
                        ? 'ring-2 ring-primary-400 shadow-lg' 
                        : 'hover:bg-gray-600'
                    }`}
                  >
                    <ApperIcon name={tool.icon} className="w-4 h-4 mr-2" />
                    {tool.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                Zone Management
              </label>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {zones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-5 h-5 rounded-full border-2 border-white/20 shadow-lg" 
                        style={{ backgroundColor: zone.color }}
                      ></div>
                      <div>
                        <span className="text-sm font-medium text-white">{zone.name}</span>
                        <span className="text-xs text-gray-400 ml-2">${zone.price}</span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditZone(zone)}
                        className="p-1 hover:bg-gray-700 transition-colors"
                      >
                        <ApperIcon name="Edit2" className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteZone(zone.id)}
                        className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
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
                className="w-full mb-4 transform hover:scale-105 transition-all duration-200"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Zone
              </Button>
              
              <label className="block text-sm font-medium text-gray-300 mb-2">Current Zone</label>
              <Select
                value={currentZone || ""}
                onChange={(e) => setCurrentZone(parseInt(e.target.value))}
                disabled={zones.length === 0}
                className="transition-all duration-200"
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
                className="w-full mt-2 transform hover:scale-105 transition-all duration-200"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Generate Row
              </Button>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                <ApperIcon name="Zap" className="w-4 h-4 mr-2" />
                Actions
              </label>
              <div className="space-y-2">
                <Button
                  variant="primary"
                  onClick={handleSave}
                  className="w-full transform hover:scale-105 transition-all duration-200"
                >
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                  Save Map
                </Button>
                <Button
                  variant="accent"
                  onClick={handleExportJSON}
                  className="w-full transform hover:scale-105 transition-all duration-200"
                >
                  <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setSeats([])}
                  className="w-full transform hover:scale-105 transition-all duration-200"
                >
                  <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

<Card className="p-6 bg-gradient-to-br from-surface to-surface-light border-gray-700 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <ApperIcon name="Layout" className="w-5 h-5 mr-2 text-primary-400" />
            Seat Map Preview
          </h3>
          <div className="flex items-center space-x-4 text-sm">
            {zones.map((zone) => (
              <div key={zone.id} className="flex items-center bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                <div 
                  className="w-4 h-4 rounded-full mr-2 border border-white/20 shadow-lg" 
                  style={{ backgroundColor: zone.color }}
                ></div>
                <span className="text-gray-300 font-medium">{zone.name}</span>
                <span className="text-gray-400 ml-1">(${zone.price})</span>
              </div>
            ))}
            <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2 border border-white/20"></div>
              <span className="text-gray-300 font-medium">Occupied</span>
            </div>
            <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2 border border-white/20"></div>
              <span className="text-gray-300 font-medium">Available</span>
            </div>
          </div>
        </div>

        <div
          ref={canvasRef}
          className="relative w-full h-96 bg-gray-900 border-2 border-gray-600 rounded-xl overflow-auto cursor-crosshair transition-all duration-300 hover:border-gray-500 shadow-inner"
          onClick={handleCanvasClick}
          style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}
        >
>
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-900/50 backdrop-blur-sm">
              <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
                <ApperIcon name="Loader2" className="w-8 h-8 mx-auto mb-3 animate-spin text-primary-400" />
                <p className="text-gray-300">Loading seat map...</p>
              </div>
            </div>
          ) : (
              {/* Aisles */}
              {aisles.map((aisle) => (
                <div
                  key={aisle.id}
                  className="absolute bg-gray-600 opacity-50 border border-gray-500 cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ 
                    left: aisle.x, 
                    top: aisle.y,
                    width: aisle.width,
                    height: aisle.length
                  }}
                  onClick={() => handleAisleClick(aisle)}
                  title={`${aisle.name || aisle.Name} - ${aisle.width}x${aisle.length}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-white font-bold transform rotate-90">
                      {aisle.name || aisle.Name}
                    </span>
                  </div>
                </div>
              ))}

              {/* Entry/Exits */}
              {entryExits.map((entryExit) => (
                <div
                  key={entryExit.id}
                  className="absolute cursor-pointer hover:scale-110 transition-transform"
                  style={{ left: entryExit.x, top: entryExit.y }}
                  onClick={() => handleEntryExitClick(entryExit)}
                  title={`${entryExit.name || entryExit.Name} - Capacity: ${entryExit.capacity}`}
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center border-2 border-blue-300">
                    <ApperIcon name="DoorOpen" className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-400 font-bold whitespace-nowrap">
                    {entryExit.name || entryExit.Name}
                  </div>
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                    {entryExit.capacity}
                  </div>
                </div>
              ))}

              {/* Seats */}
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
              
{seats.length === 0 && entryExits.length === 0 && aisles.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center p-8 bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur-sm">
                    <ApperIcon name="Grid3X3" className="w-16 h-16 mx-auto mb-4 opacity-50 text-primary-400" />
                    <p className="text-gray-300 text-lg mb-2">Empty Canvas</p>
                    <p className="text-gray-400">Click to add seats, entry/exits, or aisles using tools above</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-400">{seats.length}</p>
              <p className="text-gray-400">Total Seats</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-400">{selectedSeats.length}</p>
              <p className="text-gray-400">Selected</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{entryExits.length}</p>
              <p className="text-gray-400">Entry/Exits</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{aisles.length}</p>
              <p className="text-gray-400">Aisles</p>
            </div>
          </div>
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
      {/* Entry/Exit Management Modal */}
      {showEntryExitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingEntryExit ? "Edit Entry/Exit" : "Create Entry/Exit"}
              </h3>
              <Button variant="ghost" onClick={() => setShowEntryExitModal(false)}>
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Entry/Exit Name
                </label>
                <Input
                  value={entryExitFormData.name}
                  onChange={(e) => setEntryExitFormData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  placeholder="Enter entry/exit name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Capacity
                </label>
                <Input
                  type="number"
                  value={entryExitFormData.capacity}
                  onChange={(e) => setEntryExitFormData(prev => ({
                    ...prev,
                    capacity: parseInt(e.target.value) || 0
                  }))}
                  placeholder="Enter capacity"
                  min="1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    X Position
                  </label>
                  <Input
                    type="number"
                    value={entryExitFormData.x}
                    onChange={(e) => setEntryExitFormData(prev => ({
                      ...prev,
                      x: parseInt(e.target.value) || 0
                    }))}
                    placeholder="X"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Y Position
                  </label>
                  <Input
                    type="number"
                    value={entryExitFormData.y}
                    onChange={(e) => setEntryExitFormData(prev => ({
                      ...prev,
                      y: parseInt(e.target.value) || 0
                    }))}
                    placeholder="Y"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <Button 
                variant="secondary" 
                onClick={() => setShowEntryExitModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleEntryExitFormSubmit}
              >
                {editingEntryExit ? "Update Entry/Exit" : "Create Entry/Exit"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Aisle Management Modal */}
{showAisleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingAisle ? "Edit Aisle" : "Create Aisle"}
              </h3>
              <Button variant="ghost" onClick={() => setShowAisleModal(false)}>
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Aisle Name
                </label>
                <Input
                  value={aisleFormData.name}
                  onChange={(e) => setAisleFormData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  placeholder="Enter aisle name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Width
                  </label>
                  <Input
                    type="number"
                    value={aisleFormData.width}
                    onChange={(e) => setAisleFormData(prev => ({
                      ...prev,
                      width: parseInt(e.target.value) || 0
                    }))}
                    placeholder="Width"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Length
                  </label>
                  <Input
                    type="number"
                    value={aisleFormData.length}
                    onChange={(e) => setAisleFormData(prev => ({
                      ...prev,
                      length: parseInt(e.target.value) || 0
                    }))}
                    placeholder="Length"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    X Position
                  </label>
                  <Input
                    type="number"
                    value={aisleFormData.x}
                    onChange={(e) => setAisleFormData(prev => ({
                      ...prev,
                      x: parseInt(e.target.value) || 0
                    }))}
                    placeholder="X"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Y Position
                  </label>
                  <Input
                    type="number"
                    value={aisleFormData.y}
                    onChange={(e) => setAisleFormData(prev => ({
                      ...prev,
                      y: parseInt(e.target.value) || 0
                    }))}
                    placeholder="Y"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <Button 
                variant="secondary" 
                onClick={() => setShowAisleModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleAisleFormSubmit}
              >
                {editingAisle ? "Update Aisle" : "Create Aisle"}
              </Button>
            </div>
          </Card>
        </div>
)}
    </div>
  );
};

export default SeatMapBuilder;