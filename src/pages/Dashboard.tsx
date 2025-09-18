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
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isToolbarOpen, toggleToolbar } = useAccessibility();

  const handleToggleNotifications = () => {
    setIsNotificationOpen(prev => !prev);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

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
                alt="Interface profissional do painel mostrando análises e métricas de desempenho"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative p-8">
                <h1 id="hero-heading" className="text-3xl font-bold text-white mb-2">Bem-vindo ao Painel</h1>
                <p className="text-white/90">Monitore o desempenho do seu negócio com análises abrangentes</p>
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
    setIsSidebarOpen(false); // Close sidebar on mobile when navigating
    // Announce page change to screen readers
    const main = document.querySelector('main');
    if (main) {
      main.focus();
    }
    // Announce section change to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Navegando para seção: ${section}`;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
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
        Pular para o conteúdo principal
      </a>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />
      )}

      {/* Accessible sidebar navigation */}
      <DashboardSidebar
        activeSection={activeSection}
        onNavClick={handleNavClick}
      />

      {/* Main content area with proper landmarks */}
      <div className="lg:ml-64">
        <DashboardHeader
          isNotificationOpen={isNotificationOpen}
          onToggleNotifications={handleToggleNotifications}
          onToggleSidebar={handleToggleSidebar}
        />

        <main id="main-content" className="p-4 sm:p-6" tabIndex={-1}>
          <div aria-live="polite" aria-atomic="true">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Accessible status indicator - responsive positioning */}
      <div className="fixed bottom-4 right-4 stat-card p-3 sm:p-4 rounded-lg z-30" role="status" aria-live="polite">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success-low rounded-full" aria-hidden="true"></div>
          <span className="nav-text text-xs sm:text-sm">Sistema Online</span>
        </div>
      </div>

      {/* Accessible floating action button - responsive positioning */}
      <button
        className="fixed bottom-4 left-4 lg:left-80 gradient-primary p-3 rounded-full accessible-focus transition-transform hover:scale-105 z-30"
        aria-label="Adicionar novo item"
        title="Adicionar novo item"
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