import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const EventCard = ({ event, onEdit, onView, onDelete }) => {
  const statusColors = {
    draft: "default",
    published: "success",
    cancelled: "danger",
    completed: "primary"
  };

  return (
    <Card className="p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{event.name}</h3>
          <div className="flex items-center text-gray-400 text-sm space-x-4 mb-3">
            <div className="flex items-center">
              <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
              {format(new Date(event.date), "MMM dd, yyyy")}
            </div>
            <div className="flex items-center">
              <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
              {format(new Date(event.date), "h:mm a")}
            </div>
            <div className="flex items-center">
              <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
              {event.venueName}
            </div>
          </div>
          <Badge variant={statusColors[event.status]}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-800/50 rounded-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{event.ticketsSold || 0}</p>
          <p className="text-xs text-gray-400">Sold</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{event.capacity || 0}</p>
          <p className="text-xs text-gray-400">Capacity</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-accent-400">${event.revenue || 0}</p>
          <p className="text-xs text-gray-400">Revenue</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button variant="primary" size="sm" onClick={() => onView?.(event)} className="flex-1">
          <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onEdit?.(event)}>
          <ApperIcon name="Edit" className="w-4 h-4" />
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete?.(event)}>
          <ApperIcon name="Trash2" className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default EventCard;