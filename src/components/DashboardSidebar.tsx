// Intentionally poor accessibility: No semantic nav, missing ARIA labels, poor contrast
import { BarChart3, Users, Settings, Bell, FileText, Home, Zap } from 'lucide-react';

const DashboardSidebar = () => {
  // Poor practice: Using div instead of nav, no ARIA labels
  return (
    <div className="sidebar-bg w-64 h-screen fixed left-0 top-0 p-6">
      {/* Poor practice: No alt text, decorative image without proper handling */}
      <div className="mb-8">
        <div className="text-xl font-bold nav-text">AdminPanel</div>
      </div>
      
      {/* Poor practice: Using divs for navigation instead of proper nav structure */}
      <div className="space-y-2">
        {/* Poor practice: No proper button/link semantics, just clickable divs */}
        <div className="clickable-text nav-text p-3 rounded-lg hover:bg-primary/20 cursor-pointer poor-focus">
          <div className="flex items-center gap-3">
            <Home size={20} />
            <div>Dashboard</div>
          </div>
        </div>
        
        <div className="clickable-text nav-text p-3 rounded-lg hover:bg-primary/20 cursor-pointer poor-focus">
          <div className="flex items-center gap-3">
            <BarChart3 size={20} />
            <div>Analytics</div>
          </div>
        </div>
        
        <div className="clickable-text nav-text p-3 rounded-lg hover:bg-primary/20 cursor-pointer poor-focus">
          <div className="flex items-center gap-3">
            <Users size={20} />
            <div>Users</div>
          </div>
        </div>
        
        <div className="clickable-text nav-text p-3 rounded-lg hover:bg-primary/20 cursor-pointer poor-focus">
          <div className="flex items-center gap-3">
            <FileText size={20} />
            <div>Content</div>
          </div>
        </div>
        
        <div className="clickable-text nav-text p-3 rounded-lg hover:bg-primary/20 cursor-pointer poor-focus">
          <div className="flex items-center gap-3">
            <Bell size={20} />
            <div>Notifications</div>
          </div>
        </div>
        
        <div className="clickable-text nav-text p-3 rounded-lg hover:bg-primary/20 cursor-pointer poor-focus">
          <div className="flex items-center gap-3">
            <Settings size={20} />
            <div>Settings</div>
          </div>
        </div>
      </div>
      
      {/* Poor practice: No proper user info section, missing accessibility */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="stat-card p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/30"></div>
            <div>
              <div className="nav-text text-sm font-medium">Admin User</div>
              <div className="nav-text text-xs opacity-70">admin@example.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;