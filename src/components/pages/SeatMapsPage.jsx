import React, { useState } from "react";
import Layout from "@/components/organisms/Layout";
import SeatMapBuilder from "@/components/organisms/SeatMapBuilder";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useSeatMaps } from "@/hooks/useSeatMaps";
import { useVenues } from "@/hooks/useVenues";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SeatMapsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMap, setSelectedMap] = useState(null);
  const { seatMaps, loading: mapsLoading, error: mapsError, loadSeatMaps, deleteSeatMap } = useSeatMaps();
  const { venues, loading: venuesLoading } = useVenues();
  const navigate = useNavigate();

  const handleCreateSeatMap = () => {
    navigate("/seat-maps/new");
  };

  const handleEditSeatMap = (seatMap) => {
    navigate(`/seat-maps/${seatMap.Id}/edit`);
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

  const getVenueName = (venueId) => {
    const venue = venues.find(v => v.Id === venueId);
    return venue ? venue.name : "Unknown Venue";
  };

  const filteredSeatMaps = seatMaps.filter(map =>
    map.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getVenueName(map.venueId).toLowerCase().includes(searchTerm.toLowerCase())
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
              <Card key={seatMap.Id} className="p-6 hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{seatMap.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <ApperIcon name="Building" className="w-4 h-4 mr-2" />
                        {seatMap.venueId ? getVenueName(seatMap.venueId) : "Template"}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <ApperIcon name="Grid3X3" className="w-4 h-4 mr-2" />
                        {seatMap.seats?.length || 0} seats
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                        {seatMap.zones?.length || 0} zones
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {seatMap.isTemplate && (
                        <Badge variant="accent">Template</Badge>
                      )}
                      {seatMap.zones?.map((zone) => (
                        <Badge key={zone.id} variant="primary" className="text-xs">
                          {zone.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => handleViewSeatMap(seatMap)}
                    className="flex-1"
                  >
                    <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleEditSeatMap(seatMap)}
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDeleteSeatMap(seatMap)}
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
          <div className="bg-surface rounded-xl p-6 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{filteredSeatMaps.length}</p>
                <p className="text-sm text-gray-400">Total Maps</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-400">
                  {filteredSeatMaps.reduce((sum, map) => sum + (map.seats?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-400">Total Seats</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-400">
                  {filteredSeatMaps.filter(map => map.isTemplate).length}
                </p>
                <p className="text-sm text-gray-400">Templates</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SeatMapsPage;