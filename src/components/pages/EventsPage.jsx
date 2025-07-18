import React, { useState } from "react";
import Layout from "@/components/organisms/Layout";
import EventCard from "@/components/molecules/EventCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { useEvents } from "@/hooks/useEvents";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { events, loading, error, loadEvents, deleteEvent } = useEvents();
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate("/events/new");
  };

  const handleViewEvent = (event) => {
    navigate(`/events/${event.Id}/purchase`);
  };

  const handleEditEvent = (event) => {
    navigate(`/events/${event.Id}/edit`);
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
      </div>
    </Layout>
  );
};

export default EventsPage;