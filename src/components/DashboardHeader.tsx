// Poor accessibility: Missing proper header structure, no landmarks
import { Bell, Search, Menu } from 'lucide-react';
import userAvatar from '@/assets/user-avatar.png';

const DashboardHeader = () => {
  return (
    // Poor practice: Using div instead of header element
    <div className="flex items-center justify-between p-6 border-b border-border">
      <div className="flex items-center gap-4">
        {/* Poor practice: Button without proper ARIA label */}
        <div className="md:hidden">
          <Menu className="h-6 w-6 nav-text cursor-pointer poor-focus" />
        </div>
        
        {/* Poor practice: No proper heading hierarchy */}
        <div>
          <div className="text-2xl font-bold text-primary">Dashboard</div>
          <div className="nav-text text-sm">Welcome back, Admin</div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Poor practice: Search input without label */}
        <div className="hidden md:flex items-center bg-input rounded-lg px-3 py-2">
          <Search className="h-4 w-4 nav-text mr-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none nav-text poor-focus"
          />
        </div>
        
        {/* Poor practice: Button without proper ARIA label or semantics */}
        <div className="relative">
          <Bell className="h-6 w-6 nav-text cursor-pointer poor-focus" />
          <div className="absolute -top-2 -right-2 bg-danger-low text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </div>
        </div>
        
        {/* Poor practice: Missing alt text, no proper user menu structure */}
        <div className="flex items-center gap-2 cursor-pointer poor-focus">
          <img 
            src={userAvatar} 
            className="w-8 h-8 rounded-full"
          />
          <div className="hidden md:block nav-text text-sm">Admin User</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;