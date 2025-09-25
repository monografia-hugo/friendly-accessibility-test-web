// Accessible dashboard stats with proper semantic structure and ARIA labels
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    {
      title: 'Receita Total',
      value: 'R$ 45.231,89',
      change: '+20.1%',
      changeType: 'increase',
      period: 'desde o mês passado',
      icon: DollarSign,
      ariaLabel: 'Receita total é R$ 45.231,89, aumentou 20.1% desde o mês passado'
    },
    {
      title: 'Assinaturas',
      value: '+2.350',
      change: '+180.1%',
      changeType: 'increase',
      period: 'desde o mês passado',
      icon: Users,
      ariaLabel: 'Assinaturas aumentaram para 2.350, subindo 180.1% desde o mês passado'
    },
    {
      title: 'Vendas',
      value: '+12.234',
      change: '+19%',
      changeType: 'increase',
      period: 'desde o mês passado',
      icon: TrendingUp,
      ariaLabel: 'Vendas aumentaram para 12.234, subindo 19% desde o mês passado'
    },
    {
      title: 'Ativos Agora',
      value: '+573',
      change: '+201',
      changeType: 'increase',
      period: 'desde a última hora',
      icon: Activity,
      ariaLabel: 'Atualmente 573 usuários ativos, aumentaram 201 desde a última hora'
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 px-2 sm:px-0" aria-label="Principais métricas de desempenho">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.changeType === 'increase';

        return (
          <article
            key={index}
            className="stat-card p-4 sm:p-5 lg:p-6 rounded-lg shadow-sm"
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
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mt-1" aria-label={stat.ariaLabel}>
                  {stat.value}
                </p>
                <div
                  id={`stat-description-${index}`}
                  className={`text-sm mt-1 flex items-center gap-1 ${
                    isPositive ? 'text-success-low' : 'text-danger-low'
                  }`}
                  aria-label={`Mudança: ${stat.change} ${stat.period}`}
                >
                  <span aria-hidden="true">
                    {isPositive ? '↗' : '↘'}
                  </span>
                  <span>{stat.change} {stat.period}</span>
                  <span className="sr-only">
                    {isPositive ? 'aumento' : 'diminuição'}
                  </span>
                </div>
              </div>
              <Icon
                className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-chart-secondary flex-shrink-0"
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