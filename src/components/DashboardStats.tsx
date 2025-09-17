// Accessible dashboard stats with proper semantic structure and ARIA labels
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      changeType: 'increase',
      period: 'from last month',
      icon: DollarSign,
      ariaLabel: 'Total revenue is $45,231.89, increased by 20.1% from last month'
    },
    {
      title: 'Subscriptions',
      value: '+2,350',
      change: '+180.1%',
      changeType: 'increase',
      period: 'from last month',
      icon: Users,
      ariaLabel: 'Subscriptions increased to 2,350, up 180.1% from last month'
    },
    {
      title: 'Sales',
      value: '+12,234',
      change: '+19%',
      changeType: 'increase',
      period: 'from last month',
      icon: TrendingUp,
      ariaLabel: 'Sales increased to 12,234, up 19% from last month'
    },
    {
      title: 'Active Now',
      value: '+573',
      change: '+201',
      changeType: 'increase',
      period: 'since last hour',
      icon: Activity,
      ariaLabel: 'Currently 573 active users, increased by 201 since last hour'
    }
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" aria-label="Key performance metrics">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.changeType === 'increase';
        
        return (
          <article 
            key={index}
            className="stat-card p-6 rounded-lg"
            aria-labelledby={`stat-title-${index}`}
            aria-describedby={`stat-description-${index}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 
                  id={`stat-title-${index}`}
                  className="nav-text text-sm font-medium"
                >
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-primary mt-1" aria-label={stat.ariaLabel}>
                  {stat.value}
                </p>
                <div 
                  id={`stat-description-${index}`}
                  className={`text-xs mt-1 flex items-center gap-1 ${
                    isPositive ? 'text-success-low' : 'text-danger-low'
                  }`}
                  aria-label={`Change: ${stat.change} ${stat.period}`}
                >
                  <span aria-hidden="true">
                    {isPositive ? '↗' : '↘'}
                  </span>
                  <span>{stat.change} {stat.period}</span>
                  <span className="sr-only">
                    {isPositive ? 'increase' : 'decrease'}
                  </span>
                </div>
              </div>
              <Icon 
                className="h-8 w-8 text-chart-secondary flex-shrink-0" 
                aria-hidden="true"
              />
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default DashboardStats;