import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const MetricCard = ({ title, value, change, icon, trend = "up", gradient = false }) => {
  const trendColor = trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "text-gray-400";
  const trendIcon = trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus";
  
  return (
    <Card className={`p-6 ${gradient ? "bg-gradient-to-br from-primary-600/20 to-accent-600/20 border-primary-500/30" : ""}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className={`text-3xl font-bold ${gradient ? "text-gradient" : "text-white"} mt-2`}>
            {value}
          </p>
          {change && (
            <div className={`flex items-center mt-2 ${trendColor}`}>
              <ApperIcon name={trendIcon} className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${gradient ? "bg-white/10" : "bg-primary-600/20"}`}>
          <ApperIcon name={icon} className="w-6 h-6 text-primary-400" />
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;