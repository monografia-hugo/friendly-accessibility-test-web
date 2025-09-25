// Accessible dashboard header with proper semantic structure
import { Bell, Search, Menu, X, Sun, Moon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import NotificationPanel from '@/components/NotificationPanel';
import { useTheme } from '@/hooks/useTheme';
import userAvatar from '@/assets/user-avatar.png';

interface DashboardHeaderProps {
  isNotificationOpen: boolean;
  onToggleNotifications: () => void;
  onToggleSidebar: () => void;
}

const DashboardHeader = ({ isNotificationOpen, onToggleNotifications, onToggleSidebar }: DashboardHeaderProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-50 min-h-[60px] sm:min-h-[70px]">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          className="lg:hidden accessible-focus p-2 rounded hover:bg-muted transition-colors"
          aria-label="Abrir menu de navegação"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6 nav-text" aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1 mr-4">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-primary truncate">Painel de Controle</h2>
          <p className="nav-text text-xs sm:text-sm hidden sm:block opacity-80">Bem-vindo de volta, Admin</p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
        <form className="hidden sm:flex items-center bg-input rounded-lg px-2 sm:px-3 py-1 sm:py-2" role="search">
          <label htmlFor="search-input" className="sr-only">Pesquisar no painel</label>
          <Search className="h-3 w-3 sm:h-4 sm:w-4 nav-text mr-1 sm:mr-2" aria-hidden="true" />
          <input
            id="search-input"
            type="search"
            placeholder="Pesquisar..."
            className="bg-transparent border-none outline-none nav-text accessible-focus w-20 sm:w-32 lg:w-40 text-sm"
            aria-describedby="search-instructions"
          />
          <span id="search-instructions" className="sr-only">
            Pressione Enter para pesquisar, Escape para limpar
          </span>
        </form>

        <div className="relative">
          <button
            className="relative accessible-focus p-2 rounded hover:bg-muted transition-colors"
            aria-label={`${isNotificationOpen ? 'Fechar' : 'Abrir'} notificações (3 não lidas)`}
            aria-expanded={isNotificationOpen}
            aria-haspopup="true"
            onClick={onToggleNotifications}
          >
            {isNotificationOpen ? (
              <X className="h-6 w-6 nav-text" aria-hidden="true" />
            ) : (
              <Bell className="h-6 w-6 nav-text" aria-hidden="true" />
            )}
            {!isNotificationOpen && (
              <span
                className="absolute -top-1 -right-1 bg-danger-low text-white text-sm rounded-full w-6 h-6 flex items-center justify-center"
                aria-hidden="true"
              >
                3
              </span>
            )}
          </button>

          {/* Notification Panel Dropdown */}
          {isNotificationOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[95vw] stat-card rounded-lg shadow-lg z-[9999] bg-background border"
              role="dialog"
              aria-labelledby="notifications-heading"
              aria-modal="false"
            >
              <NotificationPanel />
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="accessible-focus p-2 rounded hover:bg-muted transition-colors"
          aria-label={`Alternar para modo ${resolvedTheme === 'dark' ? 'claro' : 'escuro'}`}
          title={`Alternar para modo ${resolvedTheme === 'dark' ? 'claro' : 'escuro'}`}
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-5 w-5 nav-text" aria-hidden="true" />
          ) : (
            <Moon className="h-5 w-5 nav-text" aria-hidden="true" />
          )}
        </button>

        <button className="flex items-center gap-1 sm:gap-2 accessible-focus p-1 sm:p-2 rounded hover:bg-muted transition-colors">
          <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
            <AvatarImage
              src={userAvatar}
              alt="Foto do perfil do usuário administrador"
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm sm:text-base font-medium">
              AU
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:block nav-text text-sm sm:text-base">Usuário Admin</span>
          <span className="sr-only">Abrir menu do usuário</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;