// Main dashboard page with poor accessibility practices
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardStats from '@/components/DashboardStats';
import AnalyticsChart from '@/components/AnalyticsChart';
import UserManagement from '@/components/UserManagement';
import NotificationPanel from '@/components/NotificationPanel';
import SettingsPanel from '@/components/SettingsPanel';
import { useState } from 'react';
import dashboardHero from '@/assets/dashboard-hero.jpg';

const Dashboard = () => {
  // Poor practice: State management without proper accessibility considerations
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'analytics':
        return <AnalyticsChart />;
      case 'users':
        return <UserManagement />;
      case 'notifications':
        return <NotificationPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return (
          <>
            {/* Poor practice: Decorative background image without alt text */}
            <div 
              className="relative h-48 rounded-lg mb-6 overflow-hidden"
              style={{
                backgroundImage: `url(${dashboardHero})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative p-8">
                <div className="text-3xl font-bold text-white mb-2">Welcome to Dashboard</div>
                <div className="text-white/80">Monitor your business performance</div>
              </div>
            </div>
            
            <DashboardStats />
            <AnalyticsChart />
          </>
        );
    }
  };

  // Poor practice: Navigation without proper keyboard support
  const handleNavClick = (section: string) => {
    setActiveSection(section);
  };

  return (
    // Poor practice: Missing proper landmark structure, no skip links
    <div className="min-h-screen dashboard-bg">
      {/* Poor practice: Sidebar navigation without proper ARIA */}
      <div 
        className="sidebar-bg w-64 h-screen fixed left-0 top-0 p-6"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const navItem = target.closest('.nav-item');
          if (navItem) {
            const section = navItem.getAttribute('data-section');
            if (section) handleNavClick(section);
          }
        }}
      >
        <div className="mb-8">
          <div className="text-xl font-bold nav-text">AdminPanel</div>
        </div>
        
        <div className="space-y-2">
          <div className={`nav-item clickable-text p-3 rounded-lg cursor-pointer poor-focus ${activeSection === 'dashboard' ? 'bg-primary/20' : ''}`} data-section="dashboard">
            <div className="nav-text">Dashboard</div>
          </div>
          <div className={`nav-item clickable-text p-3 rounded-lg cursor-pointer poor-focus ${activeSection === 'analytics' ? 'bg-primary/20' : ''}`} data-section="analytics">
            <div className="nav-text">Analytics</div>
          </div>
          <div className={`nav-item clickable-text p-3 rounded-lg cursor-pointer poor-focus ${activeSection === 'users' ? 'bg-primary/20' : ''}`} data-section="users">
            <div className="nav-text">Users</div>
          </div>
          <div className={`nav-item clickable-text p-3 rounded-lg cursor-pointer poor-focus ${activeSection === 'notifications' ? 'bg-primary/20' : ''}`} data-section="notifications">
            <div className="nav-text">Notifications</div>
          </div>
          <div className={`nav-item clickable-text p-3 rounded-lg cursor-pointer poor-focus ${activeSection === 'settings' ? 'bg-primary/20' : ''}`} data-section="settings">
            <div className="nav-text">Settings</div>
          </div>
        </div>
      </div>
      
      {/* Poor practice: Missing main landmark */}
      <div className="ml-64">
        <DashboardHeader />
        
        {/* Poor practice: No proper content structure */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
      
      {/* Poor practice: Auto-playing animations without user control */}
      <div className="fixed bottom-4 right-4 stat-card p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success-low rounded-full animate-pulse"></div>
          <div className="nav-text text-sm">System Online</div>
        </div>
      </div>
      
      {/* Poor practice: Floating action without context */}
      <div className="fixed bottom-4 left-80 gradient-primary p-3 rounded-full cursor-pointer poor-focus">
        <div className="w-6 h-6 text-white text-center">+</div>
      </div>
    </div>
  );
};

export default Dashboard;