import React from "react";

const Loading = ({ type = "default" }) => {
  if (type === "seatMap") {
    return (
      <div className="w-full h-96 bg-surface rounded-xl p-6 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-gray-600 rounded w-32"></div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-600 rounded w-20"></div>
            <div className="h-8 bg-gray-600 rounded w-20"></div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="h-6 bg-gray-600 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "analytics") {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-xl p-6">
              <div className="h-4 bg-gray-600 rounded w-20 mb-3"></div>
              <div className="h-8 bg-gray-600 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-24"></div>
            </div>
          ))}
        </div>
        <div className="bg-surface rounded-xl p-6">
          <div className="h-6 bg-gray-600 rounded w-40 mb-6"></div>
          <div className="h-64 bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-surface rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gray-600 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-gray-600 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;