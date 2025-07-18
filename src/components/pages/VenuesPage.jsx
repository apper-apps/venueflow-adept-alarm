import React, { useState } from "react";
import Layout from "@/components/organisms/Layout";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { useVenues } from "@/hooks/useVenues";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VenuesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address_street: "",
    address_city: "",
    address_state: "",
    address_zip_code: "",
    address_country: "",
    capacity: "",
    description: "",
    amenities: []
  });
  const [saving, setSaving] = useState(false);
  const { venues, loading, error, loadVenues, deleteVenue } = useVenues();
  const navigate = useNavigate();

  const amenityOptions = [
    { value: "parking", label: "Parking" },
    { value: "bar", label: "Bar" },
    { value: "restaurant", label: "Restaurant" },
    { value: "concessions", label: "Concessions" },
    { value: "vip_lounges", label: "VIP Lounges" },
    { value: "dance_floor", label: "Dance Floor" }
  ];

  const handleCreateVenue = () => {
    setEditingVenue(null);
    setFormData({
      name: "",
      address_street: "",
      address_city: "",
      address_state: "",
      address_zip_code: "",
      address_country: "",
      capacity: "",
      description: "",
      amenities: []
    });
    setShowModal(true);
  };

  const handleEditVenue = (venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name || "",
      address_street: venue.address_street || "",
      address_city: venue.address_city || "",
      address_state: venue.address_state || "",
      address_zip_code: venue.address_zip_code || "",
      address_country: venue.address_country || "",
      capacity: venue.capacity || "",
      description: venue.description || "",
      amenities: venue.amenities || []
    });
    setShowModal(true);
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

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.address_city || !formData.address_state) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const venueData = {
        ...formData,
        capacity: parseInt(formData.capacity) || 0,
        amenities: formData.amenities.join(",")
      };

      if (editingVenue) {
        const venueService = (await import("@/services/api/venueService")).default;
        await venueService.update(editingVenue.Id, venueData);
        toast.success("Venue updated successfully");
      } else {
        const venueService = (await import("@/services/api/venueService")).default;
        await venueService.create(venueData);
        toast.success("Venue created successfully");
      }

      setShowModal(false);
      loadVenues();
    } catch (err) {
      toast.error(editingVenue ? "Failed to update venue" : "Failed to create venue");
    } finally {
      setSaving(false);
    }
  };

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.address_city?.toLowerCase().includes(searchTerm.toLowerCase())
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
                        {venue.address_city}, {venue.address_state}
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <ApperIcon name="Users" className="w-4 h-4 mr-2" />
                        Capacity: {venue.capacity?.toLocaleString() || "N/A"}
                      </div>
                      {venue.seat_map_id && (
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
                  {filteredVenues.filter(v => v.seat_map_id).length}
                </p>
                <p className="text-sm text-gray-400">With Seat Maps</p>
              </div>
            </div>
          </div>
        )}

        {/* Venue Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingVenue ? "Edit Venue" : "Add Venue"}
                  </h2>
                  <Button variant="ghost" onClick={() => setShowModal(false)}>
                    <ApperIcon name="X" className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <FormField
                    label="Venue Name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter venue name"
                    required
                  />

                  <FormField
                    type="textarea"
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Enter venue description"
                    rows={3}
                  />

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Address</h3>
                    <div className="space-y-4">
                      <FormField
                        label="Street Address"
                        name="address_street"
                        value={formData.address_street}
                        onChange={handleFormChange}
                        placeholder="Enter street address"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="City"
                          name="address_city"
                          value={formData.address_city}
                          onChange={handleFormChange}
                          placeholder="Enter city"
                          required
                        />
                        <FormField
                          label="State"
                          name="address_state"
                          value={formData.address_state}
                          onChange={handleFormChange}
                          placeholder="Enter state"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Zip Code"
                          name="address_zip_code"
                          value={formData.address_zip_code}
                          onChange={handleFormChange}
                          placeholder="Enter zip code"
                        />
                        <FormField
                          label="Country"
                          name="address_country"
                          value={formData.address_country}
                          onChange={handleFormChange}
                          placeholder="Enter country"
                        />
                      </div>
                    </div>
                  </div>

                  <FormField
                    type="number"
                    label="Capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleFormChange}
                    placeholder="Enter venue capacity"
                  />

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {amenityOptions.map((amenity) => (
                        <label key={amenity.value} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity.value)}
                            onChange={() => handleAmenityChange(amenity.value)}
                            className="w-4 h-4 text-primary-600 bg-surface border-gray-600 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-300">{amenity.label}</span>
                        </label>
                      ))}
                    </div>
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
                    {editingVenue ? "Update Venue" : "Add Venue"}
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

export default VenuesPage;