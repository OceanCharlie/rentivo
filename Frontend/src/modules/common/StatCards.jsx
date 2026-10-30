import { Card } from "antd";

// stats: [{ title, value, icon, color }]
const StatCards = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {stats.map((stat) => (
      <Card key={stat.title} variant="borderless" className="shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.color}`}>{stat.icon}</div>
          <div>
            <div className="text-slate-500 text-sm">{stat.title}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export default StatCards;
