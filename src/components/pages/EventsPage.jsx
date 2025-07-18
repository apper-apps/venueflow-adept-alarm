import React, { useState } from "react";
import Layout from "@/components/organisms/Layout";
import EventCard from "@/components/molecules/EventCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { useEvents } from "@/hooks/useEvents";
import { useVenues } from "@/hooks/useVenues";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    venue_name: "",
    description: "",
    date: "",
    end_date: "",
    status: "draft",
    capacity: "",
    image: "",
    pricing_orchestra: "",
    pricing_mezzanine: "",
    pricing_balcony: "",
    pricing_vip: "",
    pricing_general: ""
  });
  const [saving, setSaving] = useState(false);
  const { events, loading, error, loadEvents, deleteEvent } = useEvents();
  const { venues } = useVenues();
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setFormData({
      name: "",
      venue_name: "",
      description: "",
      date: "",
      end_date: "",
      status: "draft",
      capacity: "",
      image: "",
      pricing_orchestra: "",
      pricing_mezzanine: "",
      pricing_balcony: "",
      pricing_vip: "",
      pricing_general: ""
    });
    setShowModal(true);
  };

  const handleViewEvent = (event) => {
    navigate(`/events/${event.Id}/purchase`);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name || "",
      venue_name: event.venue_name || "",
      description: event.description || "",
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
      end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : "",
      status: event.status || "draft",
      capacity: event.capacity || "",
      image: event.image || "",
      pricing_orchestra: event.pricing_orchestra || "",
      pricing_mezzanine: event.pricing_mezzanine || "",
      pricing_balcony: event.pricing_balcony || "",
      pricing_vip: event.pricing_vip || "",
      pricing_general: event.pricing_general || ""
    });
    setShowModal(true);
  };

  const handleDeleteEvent = async (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.name}"?`)) {
      try {
        await deleteEvent(event.Id);
        toast.success("Event deleted successfully");
      } catch (err) {
        toast.error("Failed to delete event");
      }
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.venue_name || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const eventData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        capacity: parseInt(formData.capacity) || 0,
        pricing_orchestra: parseFloat(formData.pricing_orchestra) || 0,
        pricing_mezzanine: parseFloat(formData.pricing_mezzanine) || 0,
        pricing_balcony: parseFloat(formData.pricing_balcony) || 0,
        pricing_vip: parseFloat(formData.pricing_vip) || 0,
        pricing_general: parseFloat(formData.pricing_general) || 0
      };

      if (editingEvent) {
        const eventService = (await import("@/services/api/eventService")).default;
        await eventService.update(editingEvent.Id, eventData);
        toast.success("Event updated successfully");
      } else {
        const eventService = (await import("@/services/api/eventService")).default;
        await eventService.create(eventData);
        toast.success("Event created successfully");
      }

      setShowModal(false);
      loadEvents();
    } catch (err) {
      toast.error(editingEvent ? "Failed to update event" : "Failed to create event");
    } finally {
      setSaving(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venueName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Layout title="Events"><Loading /></Layout>;
  if (error) return <Layout title="Events"><Error message={error} onRetry={loadEvents} /></Layout>;

  return (
    <Layout title="Events" subtitle="Manage your events and ticket sales">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search events..."
              className="w-full sm:w-64"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </Select>
          </div>
          <Button variant="primary" onClick={handleCreateEvent}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <Empty
            title="No events found"
            description={searchTerm || statusFilter ? 
              "Try adjusting your search or filter criteria." : 
              "Create your first event to start selling tickets."
            }
            actionLabel="Create Event"
            onAction={handleCreateEvent}
            icon="Calendar"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.Id}
                event={event}
                onView={handleViewEvent}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        )}

        {/* Summary */}
        {filteredEvents.length > 0 && (
          <div className="bg-surface rounded-xl p-6 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{filteredEvents.length}</p>
                <p className="text-sm text-gray-400">Total Events</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">
                  {filteredEvents.filter(e => e.status === "published").length}
                </p>
                <p className="text-sm text-gray-400">Published</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-400">
                  {filteredEvents.reduce((sum, e) => sum + (e.ticketsSold || 0), 0)}
                </p>
                <p className="text-sm text-gray-400">Tickets Sold</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-400">
                  ${filteredEvents.reduce((sum, e) => sum + (e.revenue || 0), 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Total Revenue</p>
              </div>
            </div>
          </div>
        )}

        {/* Event Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingEvent ? "Edit Event" : "Create Event"}
                  </h2>
                  <Button variant="ghost" onClick={() => setShowModal(false)}>
                    <ApperIcon name="X" className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Event Name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Enter event name"
                      required
                    />
                    <FormField
                      label="Venue Name"
                      name="venue_name"
                      value={formData.venue_name}
                      onChange={handleFormChange}
                      placeholder="Enter venue name"
                      required
                    />
                  </div>

                  <FormField
                    type="textarea"
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Enter event description"
                    rows={3}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      type="datetime-local"
                      label="Start Date & Time"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      required
                    />
                    <FormField
                      type="datetime-local"
                      label="End Date & Time"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      type="select"
                      label="Status"
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      options={[
                        { value: "draft", label: "Draft" },
                        { value: "published", label: "Published" }
                      ]}
                    />
                    <FormField
                      type="number"
                      label="Capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleFormChange}
                      placeholder="Enter capacity"
                    />
                  </div>

                  <FormField
                    type="url"
                    label="Event Image URL"
                    name="image"
                    value={formData.image}
                    onChange={handleFormChange}
                    placeholder="Enter image URL"
                  />

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Pricing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        type="number"
                        label="Orchestra ($)"
                        name="pricing_orchestra"
                        value={formData.pricing_orchestra}
                        onChange={handleFormChange}
                        placeholder="0.00"
                        step="0.01"
                      />
                      <FormField
                        type="number"
                        label="Mezzanine ($)"
                        name="pricing_mezzanine"
                        value={formData.pricing_mezzanine}
                        onChange={handleFormChange}
                        placeholder="0.00"
                        step="0.01"
                      />
                      <FormField
                        type="number"
                        label="Balcony ($)"
                        name="pricing_balcony"
                        value={formData.pricing_balcony}
                        onChange={handleFormChange}
                        placeholder="0.00"
                        step="0.01"
                      />
                      <FormField
                        type="number"
                        label="VIP ($)"
                        name="pricing_vip"
                        value={formData.pricing_vip}
                        onChange={handleFormChange}
                        placeholder="0.00"
                        step="0.01"
                      />
                      <FormField
                        type="number"
                        label="General ($)"
                        name="pricing_general"
                        value={formData.pricing_general}
                        onChange={handleFormChange}
                        placeholder="0.00"
                        step="0.01"
                      />
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
                    {editingEvent ? "Update Event" : "Create Event"}
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

export default EventsPage;