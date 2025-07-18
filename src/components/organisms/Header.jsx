import React, { useContext } from "react";
import { useSelector } from 'react-redux';
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "../../App";
import { useTheme } from "@/contexts/ThemeContext";
import useKeyboardShortcuts from "@/hooks/useKeyboardShortcuts";
const Header = ({ onMenuClick, title = "Dashboard", subtitle }) => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { theme, toggleTheme, isDark } = useTheme();
  const { shortcuts, showHelp, setShowHelp } = useKeyboardShortcuts();

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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowHelp(true)}
            title="Keyboard Shortcuts (Ctrl + ?)"
          >
            <ApperIcon name="Keyboard" className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode (Ctrl + T)`}
          >
            <ApperIcon name={isDark ? "Sun" : "Moon"} className="w-5 h-5" />
          </Button>
          {isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
              <ApperIcon name="LogOut" className="w-5 h-5" />
            </Button>
          )}
        </div>
</div>
      
      {/* Keyboard Shortcuts Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowHelp(false)}>
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-mono rounded text-gray-900 dark:text-white">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <ApperIcon name="Info" className="w-4 h-4 inline mr-1" />
                Use Ctrl (or Cmd on Mac) + the indicated key to trigger shortcuts
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;