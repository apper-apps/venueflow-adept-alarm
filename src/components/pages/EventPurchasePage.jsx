import React, { useState, useEffect } from "react";
import Layout from "@/components/organisms/Layout";
import TicketPurchaseFlow from "@/components/organisms/TicketPurchaseFlow";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import eventService from "@/services/api/eventService";
import seatMapService from "@/services/api/seatMapService";
import venueService from "@/services/api/venueService";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EventPurchasePage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [venue, setVenue] = useState(null);
  const [seatMap, setSeatMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEventData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const eventData = await eventService.getById(parseInt(eventId));
      if (!eventData) {
        setError("Event not found");
        return;
      }
      setEvent(eventData);

      const venueData = await venueService.getById(eventData.venueId);
      setVenue(venueData);

      if (venueData?.seatMapId) {
        const seatMapData = await seatMapService.getById(venueData.seatMapId);
        setSeatMap(seatMapData);
      }
    } catch (err) {
      setError("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventData();
  }, [eventId]);

  const handlePurchaseComplete = (tickets) => {
    toast.success(`Successfully purchased ${tickets.length} ticket(s)!`);
    navigate("/events");
  };

  if (loading) return <Layout title="Purchase Tickets"><Loading /></Layout>;
  if (error) return <Layout title="Purchase Tickets"><Error message={error} onRetry={loadEventData} /></Layout>;

  return (
    <Layout title={`Purchase Tickets - ${event?.name}`}>
      <TicketPurchaseFlow
        event={event}
        seatMap={seatMap}
        onComplete={handlePurchaseComplete}
      />
    </Layout>
  );
};

export default EventPurchasePage;