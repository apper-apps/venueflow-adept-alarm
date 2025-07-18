import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by creating your first item.", 
  actionLabel = "Create New",
  onAction,
  icon = "Plus"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-400 mb-8 max-w-md">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction} variant="primary" size="lg">
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;