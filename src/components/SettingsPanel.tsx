// Poor accessibility: Missing form structure, labels, and proper controls
import { Save, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const SettingsPanel = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Poor practice: No proper heading hierarchy */}
      <div className="text-xl font-semibold text-primary">Settings</div>
      
      {/* Poor practice: Form without proper structure */}
      <div className="space-y-6">
        
        {/* Account Settings - Poor accessibility */}
        <div className="stat-card p-6 rounded-lg">
          <div className="mb-4 text-nav-text font-medium">Account Information</div>
          <div className="space-y-4">
            {/* Poor practice: Inputs without labels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="First Name"
                defaultValue="Admin"
                className="bg-input border border-border rounded-lg px-3 py-2 nav-text poor-focus"
              />
              <input 
                type="text" 
                placeholder="Last Name"
                defaultValue="User"
                className="bg-input border border-border rounded-lg px-3 py-2 nav-text poor-focus"
              />
            </div>
            <input 
              type="email" 
              placeholder="Email Address"
              defaultValue="admin@example.com"
              className="w-full bg-input border border-border rounded-lg px-3 py-2 nav-text poor-focus"
            />
            
            {/* Poor practice: Password field without proper labeling */}
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="New Password"
                className="w-full bg-input border border-border rounded-lg px-3 py-2 pr-10 nav-text poor-focus"
              />
              <div 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer poor-focus"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 
                  <EyeOff className="h-4 w-4 nav-text" /> : 
                  <Eye className="h-4 w-4 nav-text" />
                }
              </div>
            </div>
          </div>
        </div>
        
        {/* Preferences - Poor accessibility */}
        <div className="stat-card p-6 rounded-lg">
          <div className="mb-4 text-nav-text font-medium">Preferences</div>
          <div className="space-y-4">
            {/* Poor practice: Checkboxes without proper labels */}
            <div className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="poor-focus" />
              <div className="nav-text text-sm">Email notifications</div>
            </div>
            
            <div className="flex items-center gap-3">
              <input type="checkbox" className="poor-focus" />
              <div className="nav-text text-sm">SMS notifications</div>
            </div>
            
            <div className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="poor-focus" />
              <div className="nav-text text-sm">Marketing emails</div>
            </div>
            
            {/* Poor practice: Select without proper labeling */}
            <div className="space-y-2">
              <div className="nav-text text-sm">Theme</div>
              <select className="bg-input border border-border rounded-lg px-3 py-2 nav-text poor-focus">
                <option>Dark</option>
                <option>Light</option>
                <option>Auto</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <div className="nav-text text-sm">Language</div>
              <select className="bg-input border border-border rounded-lg px-3 py-2 nav-text poor-focus">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Poor practice: Buttons without proper context */}
        <div className="flex gap-4">
          <div className="gradient-primary px-6 py-2 rounded-lg cursor-pointer poor-focus text-sm font-medium flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </div>
          <div className="bg-secondary px-6 py-2 rounded-lg cursor-pointer poor-focus text-sm font-medium nav-text">
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;