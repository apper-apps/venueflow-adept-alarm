import React, { useState } from "react";
import Layout from "@/components/organisms/Layout";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useVenues } from "@/hooks/useVenues";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VenuesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { venues, loading, error, loadVenues, deleteVenue } = useVenues();
  const navigate = useNavigate();

  const handleCreateVenue = () => {
    navigate("/venues/new");
  };

  const handleEditVenue = (venue) => {
    navigate(`/venues/${venue.Id}/edit`);
  };

  const handleDeleteVenue = async (venue) => {
    if (window.confirm(`Are you sure you want to delete "${venue.name}"?`)) {
      try {
        await deleteVenue(venue.Id);
        toast.success("Venue deleted successfully");
      } catch (err) {
        toast.error("Failed to delete venue");
      }
    }
  };

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.address?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Layout title="Venues"><Loading /></Layout>;
  if (error) return <Layout title="Venues"><Error message={error} onRetry={loadVenues} /></Layout>;

  return (
    <Layout title="Venues" subtitle="Manage your event venues and locations">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search venues..."
            className="w-full sm:w-64"
          />
          <Button variant="primary" onClick={handleCreateVenue}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Venue
          </Button>
        </div>

        {/* Venues Grid */}
        {filteredVenues.length === 0 ? (
          <Empty
            title="No venues found"
            description={searchTerm ? 
              "Try adjusting your search criteria." : 
              "Add your first venue to start creating events."
            }
            actionLabel="Add Venue"
            onAction={handleCreateVenue}
            icon="Building"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => (
              <Card key={venue.Id} className="p-6 hover:scale-[1.02] transition-transform duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{venue.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-400 text-sm">
                        <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                        {venue.address?.city}, {venue.address?.state}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <ApperIcon name="Users" className="w-4 h-4 mr-2" />
                        Capacity: {venue.capacity?.toLocaleString() || "N/A"}
                      </div>
                      {venue.seatMapId && (
                        <div className="flex items-center text-gray-400 text-sm">
                          <ApperIcon name="Grid3X3" className="w-4 h-4 mr-2" />
                          Seat map configured
                        </div>
                      )}
                    </div>
                    
                    {venue.amenities && venue.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {venue.amenities.slice(0, 3).map((amenity) => (
                          <Badge key={amenity} variant="primary" className="text-xs">
                            {amenity.replace("_", " ")}
                          </Badge>
                        ))}
                        {venue.amenities.length > 3 && (
                          <Badge variant="default" className="text-xs">
                            +{venue.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => navigate(`/venues/${venue.Id}`)}
                    className="flex-1"
                  >
                    <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleEditVenue(venue)}
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDeleteVenue(venue)}
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {filteredVenues.length > 0 && (
          <div className="bg-surface rounded-xl p-6 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{filteredVenues.length}</p>
                <p className="text-sm text-gray-400">Total Venues</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary-400">
                  {filteredVenues.reduce((sum, v) => sum + (v.capacity || 0), 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Total Capacity</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-400">
                  {filteredVenues.filter(v => v.seatMapId).length}
                </p>
                <p className="text-sm text-gray-400">With Seat Maps</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VenuesPage;