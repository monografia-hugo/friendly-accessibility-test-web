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
// import AccessibilityTests from '@/components/AccessibilityTests';
import AccessibleForms from '@/components/AccessibleForms';
import KeyboardNavigation from '@/components/KeyboardNavigation';
import AccessibleMedia from '@/components/AccessibleMedia';
import ContrastTests from '@/components/ContrastTests';
import { useState } from 'react';
import dashboardHero from '@/assets/dashboard-hero.jpg';
import TextSection from '@/components/TextSection';

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
      // case 'accessibility-tests':
      //   return <AccessibilityTests />;
      case 'accessible-forms':
        return <AccessibleForms />;
      case 'keyboard-navigation':
        return <KeyboardNavigation />;
      case 'accessible-media':
        return <AccessibleMedia />;
      case 'contrast-tests':
        return <ContrastTests />;
      default:
        return (
          <>
            {/* Accessible hero section with proper semantic structure */}
            <section
              className="relative h-40 sm:h-48 lg:h-56 rounded-lg mb-4 sm:mb-6 overflow-hidden mx-2 sm:mx-0"
              aria-labelledby="hero-heading"
              role="banner"
            >
              <img
              src={dashboardHero}
                alt="Interface profissional do painel mostrando análises e métricas de desempenho"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
                <h1 id="hero-heading" className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Bem-vindo ao Painel</h1>
                <p className="text-sm sm:text-base text-white/90">Monitore o desempenho do seu negócio com análises abrangentes</p>
              </div>
            </section>

            <DashboardStats />
            <TextSection />
            {/* <AnalyticsChart /> */}
            <VideoSection />
            <ImageGallery />
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
      {/* Skip links for keyboard users */}
      <div className="sr-only focus-within:not-sr-only">
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo principal
        </a>
        <a href="#navigation" className="skip-link">
          Pular para a navegação
        </a>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />
      )}

      {/* Accessible sidebar navigation */}
      <div className={`fixed left-0 top-0 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:block`}>
        <DashboardSidebar
          activeSection={activeSection}
          onNavClick={handleNavClick}
          id="navigation"
        />
      </div>

      {/* Main content area with proper landmarks */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <DashboardHeader
          isNotificationOpen={isNotificationOpen}
          onToggleNotifications={handleToggleNotifications}
          onToggleSidebar={handleToggleSidebar}
        />

        <main id="main-content" className="flex-1 p-3 sm:p-4 lg:p-6" tabIndex={-1}>
          <div aria-live="polite" aria-atomic="true" className="max-w-full overflow-hidden">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Accessible status indicator - responsive positioning */}
      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 lg:right-6 stat-card p-2 sm:p-3 lg:p-4 rounded-lg z-30 shadow-lg" role="status" aria-live="polite">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-2 h-2 bg-success-low rounded-full" aria-hidden="true"></div>
          <span className="nav-text text-xs sm:text-sm font-medium">Sistema Online</span>
        </div>
      </div>


      {/* Accessibility Toolbar */}
      <AccessibilityToolbar
        isOpen={isToolbarOpen}
        onToggle={toggleToolbar}
      />
    </div>
  );
};

export default Dashboard;