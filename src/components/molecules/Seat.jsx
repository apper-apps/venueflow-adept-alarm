import React from "react";
import { cn } from "@/utils/cn";

const Seat = ({ 
  seat, 
  isSelected, 
  onSelect, 
  disabled = false,
  size = "default"
}) => {
  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect(seat);
    }
  };

const getSeatClass = () => {
    if (disabled || seat.status === "occupied") {
      return "seat-occupied";
    }
    if (isSelected) {
      return "seat-selected";
    }
    return "seat-available";
  };

  const getSeatStyle = () => {
    if (disabled || seat.status === "occupied") {
      return {};
    }
    if (isSelected) {
      return {};
    }
    if (seat.zoneColor) {
      return { backgroundColor: seat.zoneColor };
    }
    return {};
  };

  const sizeClasses = {
    small: "w-4 h-4 text-xs",
    default: "w-6 h-6 text-xs",
    large: "w-8 h-8 text-sm"
  };

return (
    <div
      className={cn(
        "rounded-sm flex items-center justify-center font-medium border border-white/20",
        getSeatClass(),
        sizeClasses[size],
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
      style={getSeatStyle()}
      onClick={handleClick}
      title={`Seat ${seat.number} - ${seat.row} - ${seat.zone || 'No Zone'} - $${seat.price || 0}`}
    >
      {seat.number}
    </div>
  );
};

export default Seat;