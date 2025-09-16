// Accessible dashboard page following WCAG guidelines
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardStats from '@/components/DashboardStats';
import VideoSection from '@/components/VideoSection';
import ImageGallery from '@/components/ImageGallery';
import FormSection from '@/components/FormSection';
import AnalyticsChart from '@/components/AnalyticsChart';
import AccessibilityToolbar from '@/components/AccessibilityToolbar';
import { useAccessibility } from '@/hooks/useAccessibility';
import UserManagement from '@/components/UserManagement';
import NotificationPanel from '@/components/NotificationPanel';
import SettingsPanel from '@/components/SettingsPanel';
import { useState } from 'react';
import dashboardHero from '@/assets/dashboard-hero.jpg';

const Dashboard = () => {
  // Accessible state management with proper section handling
  const [activeSection, setActiveSection] = useState('dashboard');
  const { isToolbarOpen, toggleToolbar } = useAccessibility();

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
            {/* Accessible hero section with proper semantic structure */}
            <section 
              className="relative h-48 rounded-lg mb-6 overflow-hidden"
              aria-labelledby="hero-heading"
              role="banner"
            >
              <img 
                src={dashboardHero} 
                alt="Professional dashboard interface showing analytics and performance metrics"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative p-8">
                <h1 id="hero-heading" className="text-3xl font-bold text-white mb-2">Welcome to Dashboard</h1>
                <p className="text-white/90">Monitor your business performance with comprehensive analytics</p>
              </div>
            </section>
            
            <DashboardStats />
            <VideoSection />
            <ImageGallery />
            <AnalyticsChart />
            <FormSection />
          </>
        );
    }
  };

  // Accessible navigation with proper keyboard support
  const handleNavClick = (section: string) => {
    setActiveSection(section);
    // Announce page change to screen readers
    const main = document.querySelector('main');
    if (main) {
      main.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, section: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavClick(section);
    }
  };

  return (
    <div className="min-h-screen dashboard-bg">
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Accessible sidebar navigation */}
      <nav 
        className="sidebar-bg w-64 h-screen fixed left-0 top-0 p-6"
        aria-label="Main navigation"
        role="navigation"
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold nav-text">AdminPanel</h2>
        </div>
        
        <ul className="space-y-2" role="list">
          <li>
            <button 
              className={`w-full text-left p-3 rounded-lg accessible-focus transition-colors ${activeSection === 'dashboard' ? 'bg-primary/20 nav-text' : 'nav-text hover:bg-primary/10'}`}
              onClick={() => handleNavClick('dashboard')}
              onKeyDown={(e) => handleKeyDown(e, 'dashboard')}
              aria-current={activeSection === 'dashboard' ? 'page' : undefined}
            >
              <span className="nav-text">Dashboard</span>
            </button>
          </li>
          <li>
            <button 
              className={`w-full text-left p-3 rounded-lg accessible-focus transition-colors ${activeSection === 'analytics' ? 'bg-primary/20 nav-text' : 'nav-text hover:bg-primary/10'}`}
              onClick={() => handleNavClick('analytics')}
              onKeyDown={(e) => handleKeyDown(e, 'analytics')}
              aria-current={activeSection === 'analytics' ? 'page' : undefined}
            >
              <span className="nav-text">Analytics</span>
            </button>
          </li>
          <li>
            <button 
              className={`w-full text-left p-3 rounded-lg accessible-focus transition-colors ${activeSection === 'users' ? 'bg-primary/20 nav-text' : 'nav-text hover:bg-primary/10'}`}
              onClick={() => handleNavClick('users')}
              onKeyDown={(e) => handleKeyDown(e, 'users')}
              aria-current={activeSection === 'users' ? 'page' : undefined}
            >
              <span className="nav-text">Users</span>
            </button>
          </li>
          <li>
            <button 
              className={`w-full text-left p-3 rounded-lg accessible-focus transition-colors ${activeSection === 'notifications' ? 'bg-primary/20 nav-text' : 'nav-text hover:bg-primary/10'}`}
              onClick={() => handleNavClick('notifications')}
              onKeyDown={(e) => handleKeyDown(e, 'notifications')}
              aria-current={activeSection === 'notifications' ? 'page' : undefined}
            >
              <span className="nav-text">Notifications</span>
            </button>
          </li>
          <li>
            <button 
              className={`w-full text-left p-3 rounded-lg accessible-focus transition-colors ${activeSection === 'settings' ? 'bg-primary/20 nav-text' : 'nav-text hover:bg-primary/10'}`}
              onClick={() => handleNavClick('settings')}
              onKeyDown={(e) => handleKeyDown(e, 'settings')}
              aria-current={activeSection === 'settings' ? 'page' : undefined}
            >
              <span className="nav-text">Settings</span>
            </button>
          </li>
        </ul>
      </nav>
      
      {/* Main content area with proper landmarks */}
      <div className="ml-64">
        <DashboardHeader />
        
        <main id="main-content" className="p-6" tabIndex={-1}>
          <div aria-live="polite" aria-atomic="true">
            {renderContent()}
          </div>
        </main>
      </div>
      
      {/* Accessible status indicator */}
      <div className="fixed bottom-4 right-4 stat-card p-4 rounded-lg" role="status" aria-live="polite">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success-low rounded-full" aria-hidden="true"></div>
          <span className="nav-text text-sm">System Online</span>
        </div>
      </div>
      
      {/* Accessible floating action button */}
      <button 
        className="fixed bottom-4 left-80 gradient-primary p-3 rounded-full accessible-focus transition-transform hover:scale-105 z-40"
        aria-label="Add new item"
        title="Add new item"
      >
        <span className="w-6 h-6 text-white text-center block" aria-hidden="true">+</span>
      </button>
      
      {/* Accessibility Toolbar */}
      <AccessibilityToolbar 
        isOpen={isToolbarOpen}
        onToggle={toggleToolbar}
      />
    </div>
  );
};

export default Dashboard;