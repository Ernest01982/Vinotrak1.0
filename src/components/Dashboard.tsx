import React from 'react';
import StatCard from './StatCard';
import { Users, Building2, Phone } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Sales Reps',
      value: '12',
      icon: Users,
      trend: { value: '8.1%', isPositive: true }
    },
    {
      title: 'Active Clients',
      value: '347',
      icon: Building2,
      trend: { value: '12.3%', isPositive: true }
    },
    {
      title: 'Calls This Month',
      value: '1,284',
      icon: Phone,
      trend: { value: '3.2%', isPositive: false }
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Monitor your sales team performance and key metrics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              'John Smith completed call with ABC Corp',
              'Sarah Johnson added new client: TechStart Inc',
              'Mike Davis updated product catalog',
              'Lisa Chen scheduled follow-up with GreenTech'
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
                <span className="text-gray-300">{activity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
          <h3 className="text-xl font-semibold text-white mb-4">Top Performers</h3>
          <div className="space-y-4">
            {[
              { name: 'Sarah Johnson', sales: '$45,230', calls: 127 },
              { name: 'Mike Davis', sales: '$38,920', calls: 98 },
              { name: 'John Smith', sales: '$34,150', calls: 89 },
              { name: 'Lisa Chen', sales: '$29,840', calls: 76 }
            ].map((rep, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">{rep.name}</p>
                  <p className="text-gray-400 text-sm">{rep.calls} calls</p>
                </div>
                <div className="text-right">
                  <p className="text-sky-400 font-semibold">{rep.sales}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;