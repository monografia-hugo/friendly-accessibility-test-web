// Accessible sidebar with proper semantic structure and ARIA labels
import { BarChart3, Users, Settings, Bell, Home, TestTube, FileText, Keyboard, Video, Palette, Sparkles } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface DashboardSidebarProps {
  activeSection: string;
  onNavClick: (section: string) => void;
  id?: string;
}

const DashboardSidebar = ({ activeSection, onNavClick, id }: DashboardSidebarProps) => {
  const navItems = [
    { icon: Home, label: 'Dashboard', section: 'dashboard' },
    { icon: Sparkles, label: 'Assistente de IA', section: 'ai-assistant' },
    { icon: BarChart3, label: 'Analytics', section: 'analytics' },
    { icon: Users, label: 'Users', section: 'users' },
    { icon: Video, label: 'Mídia Acessível', section: 'accessible-media' },
    { icon: Palette, label: 'Testes de Contraste', section: 'contrast-tests' },
    { icon: Bell, label: 'Notifications', section: 'notifications' },
    { icon: Settings, label: 'Settings', section: 'settings' },
    // { icon: TestTube, label: 'Testes de Acessibilidade', section: 'accessibility-tests' },
    // { icon: FileText, label: 'Formulários Acessíveis', section: 'accessible-forms' },
    // { icon: Keyboard, label: 'Navegação por Teclado', section: 'keyboard-navigation' },
  ];

  const handleKeyDown = (event: React.KeyboardEvent, section: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onNavClick(section);
    }
  };

  return (
    <aside id={id} className="sidebar-bg w-64 h-screen p-4 sm:p-6 flex flex-col" role="navigation" aria-label="Navegação principal">
      <header className="mb-6 sm:mb-8 flex-shrink-0">
        <h2 className="text-lg sm:text-xl font-bold nav-text">AdminPanel</h2>
        <p className="sr-only">Menu de navegação principal</p>
      </header>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2" role="list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.section;
            return (
              <li key={item.label}>
                <button
                  onClick={() => onNavClick(item.section)}
                  onKeyDown={(e) => handleKeyDown(e, item.section)}
                  className={`nav-text p-2 sm:p-3 rounded-lg transition-colors accessible-focus flex items-center gap-2 sm:gap-3 w-full text-left text-sm sm:text-base ${
                    isActive ? 'bg-primary/20' : 'hover:bg-primary/10'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Navegar para ${item.label}`}
                >
                  <Icon size={18} className="sm:w-5 sm:h-5 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="flex-shrink-0 mt-4 p-2 sm:p-0">
        <div className="stat-card p-3 sm:p-4 rounded-lg" role="contentinfo" aria-label="User information">
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
              <AvatarImage
                src="/placeholder.svg"
                alt="Foto de perfil do usuário Admin User"
              />
              <AvatarFallback className="bg-primary/30 text-primary font-semibold text-xs sm:text-sm">
                AU
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="nav-text text-xs sm:text-sm font-medium truncate">Usuário Admin</div>
              <div className="nav-text text-xs opacity-80 truncate hidden sm:block">admin@example.com</div>
            </div>
          </div>
        </div>
      </footer>
    </aside>
  );
};

export default DashboardSidebar;