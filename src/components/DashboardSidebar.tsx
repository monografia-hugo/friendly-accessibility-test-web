// Accessible sidebar with proper semantic structure and ARIA labels
import { BarChart3, Users, Settings, Bell, FileText, Home } from 'lucide-react';

const DashboardSidebar = () => {
  const navItems = [
    { icon: Home, label: 'Dashboard', href: '#dashboard', current: true },
    { icon: BarChart3, label: 'Analytics', href: '#analytics', current: false },
    { icon: Users, label: 'Users', href: '#users', current: false },
    { icon: FileText, label: 'Content', href: '#content', current: false },
    { icon: Bell, label: 'Notifications', href: '#notifications', current: false },
    { icon: Settings, label: 'Settings', href: '#settings', current: false },
  ];

  return (
    <aside className="sidebar-bg w-64 h-screen fixed left-0 top-0 p-6" role="navigation" aria-label="Main navigation">
      <header className="mb-8">
        <h2 className="text-xl font-bold nav-text">AdminPanel</h2>
        <p className="sr-only">Main navigation menu</p>
      </header>
      
      <nav>
        <ul className="space-y-2" role="list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <a 
                  href={item.href}
                  className="nav-text p-3 rounded-lg hover:bg-primary/20 transition-colors accessible-focus flex items-center gap-3 w-full"
                  aria-current={item.current ? 'page' : undefined}
                  role="menuitem"
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
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