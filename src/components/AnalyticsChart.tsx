// Accessible analytics charts with proper semantic structure and WCAG compliance
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AnalyticsChart = () => {
  // Sample data with accessible descriptions
  const barData = [
    { name: 'Jan', value: 400, description: 'Janeiro: R$ 400.000' },
    { name: 'Feb', value: 300, description: 'Fevereiro: R$ 300.000' },
    { name: 'Mar', value: 600, description: 'Março: R$ 600.000' },
    { name: 'Apr', value: 800, description: 'Abril: R$ 800.000' },
    { name: 'May', value: 700, description: 'Maio: R$ 700.000' },
    { name: 'Jun', value: 900, description: 'Junho: R$ 900.000' }
  ];

  const lineData = [
    { name: 'Week 1', users: 400, revenue: 240, description: 'Semana 1: 400 usuários, R$ 240.000 receita' },
    { name: 'Week 2', users: 300, revenue: 139, description: 'Semana 2: 300 usuários, R$ 139.000 receita' },
    { name: 'Week 3', users: 200, revenue: 980, description: 'Semana 3: 200 usuários, R$ 980.000 receita' },
    { name: 'Week 4', users: 278, revenue: 390, description: 'Semana 4: 278 usuários, R$ 390.000 receita' }
  ];

  const pieData = [
    { name: 'Desktop', value: 400, description: 'Desktop: 400 usuários (50%)' },
    { name: 'Mobile', value: 300, description: 'Mobile: 300 usuários (37.5%)' },
    { name: 'Tablet', value: 100, description: 'Tablet: 100 usuários (12.5%)' }
  ];

  const COLORS = ['hsl(var(--chart-primary))', 'hsl(var(--chart-secondary))', 'hsl(var(--danger-low))'];

  // Generate accessible data table for charts
  const generateDataTable = (data: any[], type: string) => {
    return data.map((item, index) => (
      <tr key={index}>
        <td className="px-2 py-1 text-sm nav-text">{item.name}</td>
        <td className="px-2 py-1 text-sm nav-text">
          {type === 'bar' ? `R$ ${item.value}.000` :
           type === 'line' ? `${item.users} usuários, R$ ${item.revenue}.000` :
           `${item.value} usuários (${Math.round((item.value / 800) * 100)}%)`}
        </td>
      </tr>
    ));
  };

  return (
    <section className="space-y-6" aria-labelledby="analytics-heading">
      {/* Proper heading structure */}
      <h2 id="analytics-heading" className="text-xl font-semibold text-primary">Visão Geral das Análises</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accessible bar chart with data table */}
        <article className="stat-card p-6 rounded-lg" aria-labelledby="revenue-chart-heading">
          <h3 id="revenue-chart-heading" className="mb-4 nav-text font-medium">Receita Mensal</h3>
          <div className="mb-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} role="img" aria-label="Gráfico de barras mostrando receita mensal de janeiro a junho">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--nav-text))" />
                <YAxis stroke="hsl(var(--nav-text))" />
                <Bar dataKey="value" fill="hsl(var(--chart-primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Accessible data table for screen readers */}
          <div className="sr-only">
            <h4>Dados da Receita Mensal</h4>
            <table>
              <thead>
                <tr>
                  <th scope="col">Mês</th>
                  <th scope="col">Receita</th>
                </tr>
              </thead>
              <tbody>
                {generateDataTable(barData, 'bar')}
              </tbody>
            </table>
          </div>

          {/* Visual data summary */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm nav-text">
              <strong>Resumo:</strong> Receita total de R$ 3.700.000 nos últimos 6 meses.
              Maior receita em junho (R$ 900.000) e menor em fevereiro (R$ 300.000).
            </p>
          </div>
        </article>

        <article className="stat-card p-6 rounded-lg" aria-labelledby="growth-chart-heading">
          <h3 id="growth-chart-heading" className="mb-4 nav-text font-medium">Crescimento de Usuários</h3>
          <div className="mb-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData} role="img" aria-label="Gráfico de linhas mostrando crescimento de usuários e receita por semana">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--nav-text))" />
                <YAxis stroke="hsl(var(--nav-text))" />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--chart-primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-secondary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Accessible data table for screen readers */}
          <div className="sr-only">
            <h4>Dados de Crescimento de Usuários</h4>
            <table>
              <thead>
                <tr>
                  <th scope="col">Semana</th>
                  <th scope="col">Usuários e Receita</th>
                </tr>
              </thead>
              <tbody>
                {generateDataTable(lineData, 'line')}
              </tbody>
            </table>
          </div>

          {/* Visual data summary */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm nav-text">
              <strong>Resumo:</strong> 1.178 usuários totais nas 4 semanas.
              Linha azul representa usuários, linha laranja representa receita.
            </p>
          </div>
        </article>

        <article className="stat-card p-6 rounded-lg lg:col-span-2" aria-labelledby="device-chart-heading">
          <h3 id="device-chart-heading" className="mb-4 nav-text font-medium">Uso por Dispositivo</h3>
          <div className="flex justify-center mb-4">
            <ResponsiveContainer width={400} height={300}>
              <PieChart role="img" aria-label="Gráfico de pizza mostrando distribuição de usuários por tipo de dispositivo">
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Accessible legend with proper association */}
          <div className="flex justify-center gap-6 mt-4" role="list" aria-label="Legenda do gráfico de dispositivos">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2" role="listitem">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  aria-hidden="true"
                ></div>
                <div className="nav-text text-sm">{entry.name}</div>
              </div>
            ))}
          </div>

          {/* Accessible data table for screen readers */}
          <div className="sr-only">
            <h4>Dados de Uso por Dispositivo</h4>
            <table>
              <thead>
                <tr>
                  <th scope="col">Dispositivo</th>
                  <th scope="col">Usuários</th>
                </tr>
              </thead>
              <tbody>
                {generateDataTable(pieData, 'pie')}
              </tbody>
            </table>
          </div>

          {/* Visual data summary */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm nav-text">
              <strong>Resumo:</strong> 800 usuários totais. Desktop é o dispositivo mais usado (50%),
              seguido por mobile (37.5%) e tablet (12.5%).
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default AnalyticsChart;