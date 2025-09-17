// Accessible dashboard header with proper semantic structure
import { Bell, Search, Menu, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import NotificationPanel from '@/components/NotificationPanel';
import userAvatar from '@/assets/user-avatar.png';

interface DashboardHeaderProps {
  isNotificationOpen: boolean;
  onToggleNotifications: () => void;
}

const DashboardHeader = ({ isNotificationOpen, onToggleNotifications }: DashboardHeaderProps) => {
  return (
    <header className="flex items-center justify-between p-6 border-b border-border">
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden accessible-focus p-2 rounded hover:bg-muted transition-colors"
          aria-label="Open navigation menu"
          aria-expanded="false"
        >
          <Menu className="h-6 w-6 nav-text" aria-hidden="true" />
        </button>
        
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="nav-text text-sm">Welcome back, Admin</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <form className="hidden md:flex items-center bg-input rounded-lg px-3 py-2" role="search">
          <label htmlFor="search-input" className="sr-only">Search dashboard</label>
          <Search className="h-4 w-4 nav-text mr-2" aria-hidden="true" />
          <input 
            id="search-input"
            type="search" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none nav-text accessible-focus w-40"
            aria-describedby="search-instructions"
          />
          <span id="search-instructions" className="sr-only">
            Press Enter to search, Escape to clear
          </span>
        </form>
        
        <div className="relative">
          <button 
            className="relative accessible-focus p-2 rounded hover:bg-muted transition-colors"
            aria-label={`${isNotificationOpen ? 'Close' : 'Open'} notifications (3 unread)`}
            aria-expanded={isNotificationOpen}
            aria-haspopup="true"
            onClick={onToggleNotifications}
          >
            {isNotificationOpen ? (
              <X className="h-6 w-6 nav-text" aria-hidden="true" />
            ) : (
              <Bell className="h-6 w-6 nav-text" aria-hidden="true" />
            )}
            {!isNotificationOpen && (
              <span 
                className="absolute -top-1 -right-1 bg-danger-low text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                aria-hidden="true"
              >
                3
              </span>
            )}
          </button>
          
          {/* Notification Panel Dropdown */}
          {isNotificationOpen && (
            <div 
              className="absolute right-0 top-full mt-2 w-96 max-w-[90vw] stat-card rounded-lg shadow-lg z-50"
              role="dialog"
              aria-labelledby="notifications-heading"
              aria-modal="false"
            >
              <NotificationPanel />
            </div>
          )}
        </div>
        
        <button className="flex items-center gap-2 accessible-focus p-2 rounded hover:bg-muted transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={userAvatar} 
              alt="Admin User profile picture"
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              AU
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:block nav-text text-sm">Admin User</span>
          <span className="sr-only">Open user menu</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;