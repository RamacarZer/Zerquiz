import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

interface ContentStatsProps {
  stats: StatCardProps[];
}

export default function ContentStats({ stats }: ContentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

