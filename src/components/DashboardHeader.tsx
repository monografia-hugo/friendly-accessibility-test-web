// Accessible dashboard header with proper semantic structure
import { Bell, Search, Menu, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import NotificationPanel from '@/components/NotificationPanel';
import userAvatar from '@/assets/user-avatar.png';

interface DashboardHeaderProps {
  isNotificationOpen: boolean;
  onToggleNotifications: () => void;
  onToggleSidebar: () => void;
}

const DashboardHeader = ({ isNotificationOpen, onToggleNotifications, onToggleSidebar }: DashboardHeaderProps) => {
  return (
    <header className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          className="lg:hidden accessible-focus p-2 rounded hover:bg-muted transition-colors"
          aria-label="Open navigation menu"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6 nav-text" aria-hidden="true" />
        </button>
        
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">Dashboard</h1>
          <p className="nav-text text-xs sm:text-sm hidden sm:block">Welcome back, Admin</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        <form className="hidden sm:flex items-center bg-input rounded-lg px-2 sm:px-3 py-1 sm:py-2" role="search">
          <label htmlFor="search-input" className="sr-only">Search dashboard</label>
          <Search className="h-3 w-3 sm:h-4 sm:w-4 nav-text mr-1 sm:mr-2" aria-hidden="true" />
          <input 
            id="search-input"
            type="search" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none nav-text accessible-focus w-20 sm:w-32 lg:w-40 text-sm"
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
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[95vw] stat-card rounded-lg shadow-lg z-50 bg-background border"
              role="dialog"
              aria-labelledby="notifications-heading"
              aria-modal="false"
            >
              <NotificationPanel />
            </div>
          )}
        </div>
        
        <button className="flex items-center gap-1 sm:gap-2 accessible-focus p-1 sm:p-2 rounded hover:bg-muted transition-colors">
          <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
            <AvatarImage 
              src={userAvatar} 
              alt="Admin User profile picture"
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm font-medium">
              AU
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:block nav-text text-xs sm:text-sm">Admin User</span>
          <span className="sr-only">Open user menu</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;