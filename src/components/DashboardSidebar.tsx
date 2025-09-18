// Accessible sidebar with proper semantic structure and ARIA labels
import { BarChart3, Users, Settings, Bell, FileText, Home } from 'lucide-react';

interface DashboardSidebarProps {
  activeSection: string;
  onNavClick: (section: string) => void;
}

const DashboardSidebar = ({ activeSection, onNavClick }: DashboardSidebarProps) => {
  const navItems = [
    { icon: Home, label: 'Dashboard', section: 'dashboard' },
    { icon: BarChart3, label: 'Analytics', section: 'analytics' },
    { icon: Users, label: 'Users', section: 'users' },
    { icon: FileText, label: 'Content', section: 'content' },
    { icon: Bell, label: 'Notifications', section: 'notifications' },
    { icon: Settings, label: 'Settings', section: 'settings' },
  ];

  const handleKeyDown = (event: React.KeyboardEvent, section: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onNavClick(section);
    }
  };

  return (
    <aside className="sidebar-bg w-64 h-screen fixed left-0 top-0 p-6" role="navigation" aria-label="Navegação principal">
      <header className="mb-8">
        <h2 className="text-xl font-bold nav-text">AdminPanel</h2>
        <p className="sr-only">Menu de navegação principal</p>
      </header>

      <nav>
        <ul className="space-y-2" role="list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.section;
            return (
              <li key={item.label}>
                <button
                  onClick={() => onNavClick(item.section)}
                  onKeyDown={(e) => handleKeyDown(e, item.section)}
                  className={`nav-text p-3 rounded-lg transition-colors accessible-focus flex items-center gap-3 w-full text-left ${
                    isActive ? 'bg-primary/20' : 'hover:bg-primary/10'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Navegar para ${item.label}`}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="absolute bottom-6 left-6 right-6">
        <div className="stat-card p-4 rounded-lg" role="contentinfo" aria-label="User information">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-primary/30"
              role="img"
              aria-label="User avatar placeholder"
            ></div>
            <div>
              <div className="nav-text text-sm font-medium">Admin User</div>
              <div className="nav-text text-xs opacity-70">admin@example.com</div>
            </div>
          </div>
        </div>
      </footer>
    </aside>
  );
};

export default DashboardSidebar;