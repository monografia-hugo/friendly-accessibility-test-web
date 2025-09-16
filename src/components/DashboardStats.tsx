// Intentionally poor accessibility: Missing semantic structure, poor contrast
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const DashboardStats = () => {
  // Poor practice: No semantic structure, just divs
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Poor practice: No ARIA labels, poor color contrast */}
      <div className="stat-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            {/* Poor practice: Non-descriptive text, poor contrast */}
            <div className="nav-text text-sm font-medium">Total Revenue</div>
            <div className="text-2xl font-bold text-primary mt-1">$45,231.89</div>
            {/* Color-only indicator - accessibility violation */}
            <div className="text-green-500 text-xs mt-1">+20.1% from last month</div>
          </div>
          {/* Image without alt text - accessibility violation */}
          <img src="/placeholder.svg" className="h-8 w-8" />
        </div>
      </div>
      
      <div className="stat-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="nav-text text-sm font-medium">Subscriptions</div>
            <div className="text-2xl font-bold text-primary mt-1">+2350</div>
            {/* Color-only indicator - accessibility violation */}
            <div className="text-blue-500 text-xs mt-1">+180.1% from last month</div>
          </div>
          {/* Decorative image without alt - accessibility violation */}
          <img src="/placeholder.svg" className="h-8 w-8" />
        </div>
      </div>
      
      <div className="stat-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="nav-text text-sm font-medium">Sales</div>
            <div className="text-2xl font-bold text-primary mt-1">+12,234</div>
            <div className="nav-text text-xs mt-1">+19% from last month</div>
          </div>
          <TrendingUp className="h-8 w-8 text-chart-secondary" />
        </div>
      </div>
      
      <div className="stat-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="nav-text text-sm font-medium">Active Now</div>
            <div className="text-2xl font-bold text-primary mt-1">+573</div>
            <div className="nav-text text-xs mt-1">+201 since last hour</div>
          </div>
          <Activity className="h-8 w-8 text-danger-low" />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;