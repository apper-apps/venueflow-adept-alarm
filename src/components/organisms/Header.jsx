import React, { useContext } from "react";
import { useSelector } from 'react-redux';
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "../../App";

const Header = ({ onMenuClick, title = "Dashboard", subtitle }) => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
  };

  return (
    <header className="bg-surface border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden mr-4"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <ApperIcon name="HelpCircle" className="w-5 h-5" />
          </Button>
          {isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
              <ApperIcon name="LogOut" className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;