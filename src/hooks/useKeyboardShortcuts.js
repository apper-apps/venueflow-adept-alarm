import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl (or Cmd on Mac) is pressed
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      
      if (!isCtrlOrCmd) return;

      // Prevent default for our shortcuts
// Prevent default for our shortcuts
      const shortcuts = {
        'Digit1': () => navigate('/'),
        'Digit2': () => navigate('/events'),
        'Digit3': () => navigate('/venues'),
        'Digit4': () => navigate('/seat-maps'),
        'Digit5': () => navigate('/analytics'),
        'Digit6': () => navigate('/scanner'),
        'Digit7': () => navigate('/settings'),
        'KeyT': () => toggleTheme(),
        'KeyN': () => {
          // Navigate to new based on current page
          const path = window.location.pathname;
          if (path.includes('/events')) navigate('/events/new');
          else if (path.includes('/venues')) navigate('/venues/new');
          else if (path.includes('/seat-maps')) navigate('/seat-maps/new');
          else navigate('/events/new');
        },
        'KeyS': () => {
          // Trigger save action if available
          const saveEvent = new window.CustomEvent('keyboardSave');
          window.dispatchEvent(saveEvent);
        },
        'KeyE': () => {
          // Navigate to events
          navigate('/events');
        },
        'KeyV': () => {
          // Navigate to venues
          navigate('/venues');
        },
        'KeyM': () => {
          // Navigate to seat maps
          navigate('/seat-maps');
        },
        'KeyA': () => {
          // Navigate to analytics
          navigate('/analytics');
        },
        'KeyH': () => {
          // Navigate to dashboard (home)
          navigate('/');
        },
        'KeyR': () => {
          // Trigger entry/exit tool in seat map builder
          const entryExitEvent = new window.CustomEvent('keyboardEntryExit');
          window.dispatchEvent(entryExitEvent);
        },
        'KeyI': () => {
          // Trigger aisle tool in seat map builder
          const aisleEvent = new window.CustomEvent('keyboardAisle');
          window.dispatchEvent(aisleEvent);
        },
'Slash': () => {
          // Toggle help modal
          setShowHelp(prev => !prev);
        }
      };

      if (shortcuts[event.code]) {
        event.preventDefault();
        shortcuts[event.code]();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, toggleTheme]);

const shortcuts = [
    { keys: 'Ctrl + 1', description: 'Go to Dashboard' },
    { keys: 'Ctrl + 2', description: 'Go to Events' },
    { keys: 'Ctrl + 3', description: 'Go to Venues' },
    { keys: 'Ctrl + 4', description: 'Go to Seat Maps' },
    { keys: 'Ctrl + 5', description: 'Go to Analytics' },
    { keys: 'Ctrl + 6', description: 'Go to Scanner' },
    { keys: 'Ctrl + 7', description: 'Go to Settings' },
    { keys: 'Ctrl + T', description: 'Toggle Theme' },
    { keys: 'Ctrl + N', description: 'Create New Item' },
    { keys: 'Ctrl + S', description: 'Save Current Item' },
    { keys: 'Ctrl + E', description: 'Go to Events' },
    { keys: 'Ctrl + V', description: 'Go to Venues' },
    { keys: 'Ctrl + M', description: 'Go to Seat Maps' },
    { keys: 'Ctrl + A', description: 'Go to Analytics' },
    { keys: 'Ctrl + H', description: 'Go to Dashboard' },
    { keys: 'Ctrl + R', description: 'Entry/Exit Tool (Seat Map)' },
    { keys: 'Ctrl + I', description: 'Aisle Tool (Seat Map)' },
    { keys: 'Ctrl + ?', description: 'Show Keyboard Shortcuts' }
  ];

  return {
    shortcuts,
    showHelp,
    setShowHelp
  };
};

export default useKeyboardShortcuts;