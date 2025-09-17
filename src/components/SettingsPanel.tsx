// Accessible settings panel with proper form structure and labels
import { Save, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const SettingsPanel = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    theme: 'dark',
    language: 'english'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Settings saved:', formData);
    alert('Settings saved successfully!');
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-primary">Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Account Information Section */}
        <fieldset className="stat-card p-6 rounded-lg">
          <legend className="mb-4 text-nav-text font-medium">Account Information</legend>
          <div className="space-y-4">
            
            {/* Name fields with proper labels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="settings-first-name" 
                  className="block text-sm font-medium nav-text mb-2"
                >
                  First Name
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
                  Last Name
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
                Email Address
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
                New Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="settings-password"
                  name="password"
                  placeholder="Enter new password"
                  className="w-full bg-input border border-border rounded-lg px-3 py-2 pr-12 nav-text accessible-focus"
                  aria-describedby="password-toggle-desc"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded accessible-focus hover:bg-muted/50 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
                Click the eye icon to {showPassword ? 'hide' : 'show'} your password
              </p>
            </div>
          </div>
        </fieldset>
        
        {/* Preferences Section */}
        <fieldset className="stat-card p-6 rounded-lg">
          <legend className="mb-4 text-nav-text font-medium">Notification Preferences</legend>
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
                  Email notifications for account activity
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
                  SMS notifications for urgent alerts
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
                  Marketing emails and promotional content
                </label>
              </div>
            </div>
            
            {/* Theme selection with proper label */}
            <div>
              <label 
                htmlFor="theme-select" 
                className="block text-sm font-medium nav-text mb-2"
              >
                Theme Preference
              </label>
              <select 
                id="theme-select"
                name="theme"
                value={formData.theme}
                onChange={(e) => handleInputChange('theme', e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 nav-text accessible-focus"
              >
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
                <option value="auto">Auto (System Preference)</option>
              </select>
            </div>
            
            {/* Language selection with proper label */}
            <div>
              <label 
                htmlFor="language-select" 
                className="block text-sm font-medium nav-text mb-2"
              >
                Language
              </label>
              <select 
                id="language-select"
                name="language"
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 nav-text accessible-focus"
              >
                <option value="english">English</option>
                <option value="spanish">Spanish (Español)</option>
                <option value="french">French (Français)</option>
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
            Save Changes
          </button>
          
          <button 
            type="button"
            onClick={() => window.location.reload()}
            className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg accessible-focus hover:bg-secondary/80 transition-colors text-sm font-medium"
          >
            Reset to Default
          </button>
        </div>
      </form>
      
      {/* Status message for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        Settings form is ready for input
      </div>
    </div>
  );
};

export default SettingsPanel;