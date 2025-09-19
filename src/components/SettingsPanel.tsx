// Accessible settings panel with proper form structure and labels
import { Save, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

const SettingsPanel = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState({
    firstName: 'Administrador',
    lastName: 'Usuário',
    email: 'admin@example.com',
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    language: 'portuguese'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Configurações salvas:', formData);
    alert('Configurações salvas com sucesso!');
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-primary">Configurações</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Account Information Section */}
        <fieldset className="stat-card p-6 rounded-lg">
          <h3 className="mb-4 text-nav-text font-medium mt-[0.2rem] text-lg">Informações da Conta</h3>
          <div className="space-y-4">

            {/* Name fields with proper labels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="settings-first-name"
                  className="block text-sm font-medium nav-text mb-2"
                >
                  Nome
                </label>
                <input
                  type="text"
                  id="settings-first-name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 nav-text accessible-focus"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="settings-last-name"
                  className="block text-sm font-medium nav-text mb-2"
                >
                  Sobrenome
                </label>
                <input
                  type="text"
                  id="settings-last-name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 nav-text accessible-focus"
                  required
                />
              </div>
            </div>

            {/* Email field with proper label */}
            <div>
              <label
                htmlFor="settings-email"
                className="block text-sm font-medium nav-text mb-2"
              >
                Endereço de Email
              </label>
              <input
                type="email"
                id="settings-email"
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 nav-text accessible-focus"
                required
              />
            </div>

            {/* Password field with accessible toggle */}
            <div>
              <label
                htmlFor="settings-password"
                className="block text-sm font-medium nav-text mb-2"
              >
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="settings-password"
                  name="password"
                  placeholder="Digite a nova senha"
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 pr-12 nav-text accessible-focus"
                  aria-describedby="password-toggle-desc"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded accessible-focus hover:bg-muted/50 transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                  aria-describedby="password-toggle-desc"
                >
                  {showPassword ?
                    <EyeOff className="h-4 w-4 nav-text" aria-hidden="true" /> :
                    <Eye className="h-4 w-4 nav-text" aria-hidden="true" />
                  }
                </button>
              </div>
              <p id="password-toggle-desc" className="sr-only">
                Clique no ícone do olho para {showPassword ? 'ocultar' : 'mostrar'} sua senha
              </p>
            </div>
          </div>
        </fieldset>

        {/* Preferences Section */}
        <fieldset className="stat-card p-6 rounded-lg">
          <h3 className="mb-8 text-nav-text font-medium mt-[0.2rem] text-lg">Preferências de Notificação</h3>
          <div className="space-y-4">

            {/* Accessible checkboxes with proper labels */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="email-notifications"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  className="accessible-focus"
                />
                <label
                  htmlFor="email-notifications"
                  className="ml-3 nav-text text-sm cursor-pointer"
                >
                  Notificações por email para atividade da conta
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sms-notifications"
                  name="smsNotifications"
                  checked={formData.smsNotifications}
                  onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                  className="accessible-focus"
                />
                <label
                  htmlFor="sms-notifications"
                  className="ml-3 nav-text text-sm cursor-pointer"
                >
                  Notificações SMS para alertas urgentes
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="marketing-emails"
                  name="marketingEmails"
                  checked={formData.marketingEmails}
                  onChange={(e) => handleInputChange('marketingEmails', e.target.checked)}
                  className="accessible-focus"
                />
                <label
                  htmlFor="marketing-emails"
                  className="ml-3 nav-text text-sm cursor-pointer"
                >
                  Emails de marketing e conteúdo promocional
                </label>
              </div>
            </div>

            {/* Theme selection with proper label */}
            <div>
              <label
                htmlFor="theme-select"
                className="block text-sm font-medium nav-text mb-2"
              >
                Preferência de Tema
              </label>
              <select
                id="theme-select"
                name="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 nav-text accessible-focus"
              >
                <option value="dark">Modo Escuro</option>
                <option value="light">Modo Claro</option>
                <option value="system">Automático (Preferência do Sistema)</option>
              </select>
            </div>

            {/* Language selection with proper label */}
            <div>
              <label
                htmlFor="language-select"
                className="block text-sm font-medium nav-text mb-2"
              >
                Idioma
              </label>
              <select
                id="language-select"
                name="language"
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 nav-text accessible-focus"
              >
                <option value="portuguese">Português (Brasil)</option>
                <option value="english">Inglês</option>
                <option value="spanish">Espanhol (Español)</option>
                <option value="french">Francês (Français)</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Action buttons with proper semantics */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg accessible-focus hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Salvar Alterações
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg accessible-focus hover:bg-secondary/80 transition-colors text-sm font-medium"
          >
            Redefinir para Padrão
          </button>
        </div>
      </form>

      {/* Status message for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        Formulário de configurações pronto para entrada
      </div>
    </div>
  );
};

export default SettingsPanel;