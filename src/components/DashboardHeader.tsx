// Accessible dashboard header with proper semantic structure
import { Bell, Search, Menu } from 'lucide-react';
import userAvatar from '@/assets/user-avatar.png';

const DashboardHeader = () => {
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
        
        <button 
          className="relative accessible-focus p-2 rounded hover:bg-muted transition-colors"
          aria-label="View notifications (3 unread)"
        >
          <Bell className="h-6 w-6 nav-text" aria-hidden="true" />
          <span 
            className="absolute -top-1 -right-1 bg-danger-low text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            aria-hidden="true"
          >
            3
          </span>
        </button>
        
        <button className="flex items-center gap-2 accessible-focus p-2 rounded hover:bg-muted transition-colors">
          <img 
            src={userAvatar} 
            alt="Admin User profile picture"
            className="w-8 h-8 rounded-full"
          />
          <span className="hidden md:block nav-text text-sm">Admin User</span>
          <span className="sr-only">Open user menu</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;