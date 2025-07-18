import React, { useState, useRef, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Seat from "@/components/molecules/Seat";

const SeatMapBuilder = ({ seatMap, onSave, readOnly = false }) => {
  const [selectedTool, setSelectedTool] = useState("seat");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [zones, setZones] = useState(seatMap?.zones || [
    { id: 1, name: "General", color: "#10b981", price: 50 },
    { id: 2, name: "VIP", color: "#8b5cf6", price: 100 }
  ]);
  const [seats, setSeats] = useState(seatMap?.seats || []);
  const [currentZone, setCurrentZone] = useState(1);
  const canvasRef = useRef(null);

  const tools = [
    { id: "seat", name: "Add Seat", icon: "Square" },
    { id: "row", name: "Add Row", icon: "Grid3X3" },
    { id: "select", name: "Select", icon: "MousePointer" },
    { id: "delete", name: "Delete", icon: "Trash2" }
  ];

  const handleCanvasClick = (e) => {
    if (readOnly) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === "seat") {
      const newSeat = {
        id: Date.now(),
        x: Math.round(x / 30) * 30,
        y: Math.round(y / 30) * 30,
        row: `R${Math.floor(y / 30) + 1}`,
        number: seats.filter(s => s.row === `R${Math.floor(y / 30) + 1}`).length + 1,
        zoneId: currentZone,
        type: zones.find(z => z.id === currentZone)?.name.toLowerCase().includes("vip") ? "vip" : "regular",
        price: zones.find(z => z.id === currentZone)?.price || 50,
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
    }
  };

  const generateRow = () => {
    if (readOnly) return;

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
        type: zones.find(z => z.id === currentZone)?.name.toLowerCase().includes("vip") ? "vip" : "regular",
        price: zones.find(z => z.id === currentZone)?.price || 50,
        status: "available"
      });
    }
    
    setSeats([...seats, ...newSeats]);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ zones, seats });
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Current Zone</label>
              <Select
                value={currentZone}
                onChange={(e) => setCurrentZone(parseInt(e.target.value))}
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} - ${zone.price}
                  </option>
                ))}
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
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-gray-400">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
              <span className="text-gray-400">VIP</span>
            </div>
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
          {seats.map((seat) => (
            <div
              key={seat.id}
              className="absolute"
              style={{ left: seat.x, top: seat.y }}
            >
              <Seat
                seat={seat}
                isSelected={selectedSeats.includes(seat.id)}
                onSelect={handleSeatClick}
                disabled={readOnly}
              />
            </div>
          ))}
          
          {seats.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ApperIcon name="Grid3X3" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Click to add seats or use tools above</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-400">
          <p>Total Seats: {seats.length}</p>
          <p>Selected: {selectedSeats.length}</p>
        </div>
      </Card>
    </div>
  );
};

export default SeatMapBuilder;