// Accessible notification panel following WCAG guidelines
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const NotificationPanel = () => {
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Sucesso',
      message: 'Conta de usuário criada com sucesso',
      time: '2 min atrás'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Aviso',
      message: 'Carga do servidor está alta',
      time: '5 min atrás'
    },
    {
      id: 3,
      type: 'info',
      title: 'Informação',
      message: 'Nova atualização disponível',
      time: '10 min atrás'
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
    <section className="space-y-4 p-2 sm:p-4" aria-labelledby="notifications-heading">
      <h2 id="notifications-heading" className="text-lg sm:text-xl font-semibold text-primary">
        Notificações
      </h2>

      <ul className="space-y-3" role="list">
        {notifications.map((notification) => (
          <li key={notification.id}>
            <article
              className="stat-card p-3 sm:p-4 rounded-lg"
              role="alert"
              aria-labelledby={`notification-${notification.id}-title`}
              aria-describedby={`notification-${notification.id}-message notification-${notification.id}-time`}
            >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1">
                    <div className="text-chart-primary mt-0.5 flex-shrink-0" aria-hidden="true">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        id={`notification-${notification.id}-title`}
                        className="nav-text font-medium text-sm sm:text-base"
                      >
                        {notification.title}
                      </h3>
                      <p
                        id={`notification-${notification.id}-message`}
                        className="nav-text text-sm sm:text-base mt-1 break-words"
                      >
                        {notification.message}
                      </p>
                      <time
                        id={`notification-${notification.id}-time`}
                        className="nav-text text-sm mt-2 opacity-70"
                      >
                        {notification.time}
                      </time>
                    </div>
                  </div>

                  <button
                    className="accessible-focus p-1 rounded hover:bg-muted transition-colors flex-shrink-0 ml-2"
                    aria-label={`Dispensar notificação ${notification.title}`}
                    onClick={() => {
                      // Handle dismissal
                      console.log(`Dismissing notification ${notification.id}`);
                    }}
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4 nav-text" aria-hidden="true" />
                  </button>
                </div>
            </article>
          </li>
        ))}
      </ul>

      <div className="text-center">
        <button
          className="accessible-focus nav-text text-sm sm:text-base hover:text-primary transition-colors"
          onClick={() => {
            // Navigate to notifications page or expand all notifications
            console.log('Viewing all notifications');
          }}
        >
          Ver Todas as Notificações
        </button>
      </div>
    </section>
  );
};

export default NotificationPanel;