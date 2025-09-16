// Poor accessibility: Missing chart accessibility, no text alternatives
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AnalyticsChart = () => {
  // Sample data
  const barData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 700 },
    { name: 'Jun', value: 900 }
  ];

  const lineData = [
    { name: 'Week 1', users: 400, revenue: 240 },
    { name: 'Week 2', users: 300, revenue: 139 },
    { name: 'Week 3', users: 200, revenue: 980 },
    { name: 'Week 4', users: 278, revenue: 390 }
  ];

  const pieData = [
    { name: 'Desktop', value: 400 },
    { name: 'Mobile', value: 300 },
    { name: 'Tablet', value: 100 }
  ];

  const COLORS = ['hsl(var(--chart-primary))', 'hsl(var(--chart-secondary))', 'hsl(var(--danger-low))'];

  return (
    <div className="space-y-6">
      {/* Poor practice: No proper heading structure */}
      <div className="text-xl font-semibold text-primary">Analytics Overview</div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Poor practice: Charts without accessibility features */}
        <div className="stat-card p-6 rounded-lg">
          <div className="mb-4 nav-text font-medium">Monthly Revenue</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--nav-text))" />
              <YAxis stroke="hsl(var(--nav-text))" />
              <Bar dataKey="value" fill="hsl(var(--chart-primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card p-6 rounded-lg">
          <div className="mb-4 nav-text font-medium">User Growth</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--nav-text))" />
              <YAxis stroke="hsl(var(--nav-text))" />
              <Line type="monotone" dataKey="users" stroke="hsl(var(--chart-primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-secondary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card p-6 rounded-lg lg:col-span-2">
          <div className="mb-4 nav-text font-medium">Device Usage</div>
          <div className="flex justify-center">
            <ResponsiveContainer width={400} height={300}>
              <PieChart>
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
          
          {/* Poor practice: Legend without proper association */}
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <div className="nav-text text-sm">{entry.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;