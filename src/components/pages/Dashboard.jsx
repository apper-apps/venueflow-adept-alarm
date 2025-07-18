import React, { useState, useEffect } from "react";
import Layout from "@/components/organisms/Layout";
import MetricCard from "@/components/molecules/MetricCard";
import EventCard from "@/components/molecules/EventCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import eventService from "@/services/api/eventService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const eventsData = await eventService.getAll();
      setEvents(eventsData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

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
        await eventService.delete(event.Id);
        setEvents(prev => prev.filter(e => e.Id !== event.Id));
        toast.success("Event deleted successfully");
      } catch (err) {
        toast.error("Failed to delete event");
      }
    }
  };

  if (loading) return <Layout title="Dashboard"><Loading type="analytics" /></Layout>;
  if (error) return <Layout title="Dashboard"><Error message={error} onRetry={loadDashboardData} /></Layout>;

  const totalRevenue = events.reduce((sum, event) => sum + (event.revenue || 0), 0);
  const totalTicketsSold = events.reduce((sum, event) => sum + (event.ticketsSold || 0), 0);
  const activeEvents = events.filter(event => event.status === "published").length;
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;

  const recentEvents = events
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <Layout title="Dashboard" subtitle="Overview of your events and performance">
      <div className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            change="+12.5%"
            icon="DollarSign"
            trend="up"
            gradient={true}
          />
          <MetricCard
            title="Tickets Sold"
            value={totalTicketsSold.toLocaleString()}
            change="+8.2%"
            icon="Ticket"
            trend="up"
          />
          <MetricCard
            title="Active Events"
            value={activeEvents}
            change="+2"
            icon="Calendar"
            trend="up"
          />
          <MetricCard
            title="Upcoming Events"
            value={upcomingEvents}
            change="0"
            icon="Clock"
            trend="neutral"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" onClick={handleCreateEvent}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Create Event
          </Button>
          <Button variant="secondary" onClick={() => navigate("/venues/new")}>
            <ApperIcon name="Building" className="w-4 h-4 mr-2" />
            Add Venue
          </Button>
          <Button variant="secondary" onClick={() => navigate("/seat-maps/new")}>
            <ApperIcon name="Grid3X3" className="w-4 h-4 mr-2" />
            Create Seat Map
          </Button>
          <Button variant="accent" onClick={() => navigate("/scanner")}>
            <ApperIcon name="QrCode" className="w-4 h-4 mr-2" />
            Open Scanner
          </Button>
        </div>

        {/* Recent Events */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Events</h2>
            <Button variant="ghost" onClick={() => navigate("/events")}>
              View All
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {recentEvents.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="Calendar" className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No events yet</h3>
              <p className="text-gray-400 mb-6">Create your first event to get started</p>
              <Button variant="primary" onClick={handleCreateEvent}>
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Create Your First Event
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentEvents.map((event) => (
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
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;