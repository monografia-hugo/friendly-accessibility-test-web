// Poor accessibility: Missing proper announcements, poor contrast
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const NotificationPanel = () => {
  const notifications = [
    { 
      id: 1, 
      type: 'success', 
      title: 'Success', 
      message: 'User account created successfully',
      time: '2 min ago'
    },
    { 
      id: 2, 
      type: 'warning', 
      title: 'Warning', 
      message: 'Server load is high',
      time: '5 min ago'
    },
    { 
      id: 3, 
      type: 'info', 
      title: 'Info', 
      message: 'New update available',
      time: '10 min ago'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Poor practice: No proper heading */}
      <div className="text-xl font-semibold text-primary">Notifications</div>
      
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="stat-card p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="text-chart-primary mt-0.5">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  {/* Poor practice: No proper structure for notification content */}
                  <div className="nav-text font-medium text-sm">{notification.title}</div>
                  <div className="nav-text text-sm mt-1">{notification.message}</div>
                  <div className="nav-text text-xs mt-2 opacity-60">{notification.time}</div>
                </div>
              </div>
              
              {/* Poor practice: Button without ARIA label */}
              <div className="cursor-pointer poor-focus">
                <X className="h-4 w-4 nav-text" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Poor practice: Unclear action button */}
      <div className="text-center">
        <div className="clickable-text nav-text text-sm cursor-pointer poor-focus">
          View All Notifications
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;