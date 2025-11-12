import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * Dashboard Component
 * Displays analytics and statistics for issues
 */
const Dashboard = ({ issues }) => {
  // Calculate statistics
  const stats = useMemo(() => {
    const total = issues.length;
    const byStatus = {
      Open: issues.filter(i => i.status === 'Open').length,
      'In-Progress': issues.filter(i => i.status === 'In-Progress').length,
      Review: issues.filter(i => i.status === 'Review').length,
      Closed: issues.filter(i => i.status === 'Closed').length,
    };
    const byPriority = {
      Critical: issues.filter(i => i.priority === 'Critical').length,
      High: issues.filter(i => i.priority === 'High').length,
      Medium: issues.filter(i => i.priority === 'Medium').length,
      Low: issues.filter(i => i.priority === 'Low').length,
    };

    // Calculate average time to close (for closed issues)
    const closedIssues = issues.filter(i => i.status === 'Closed');
    let avgTimeToClose = 0;
    if (closedIssues.length > 0) {
      const totalTime = closedIssues.reduce((sum, issue) => {
        if (issue.createdAt && issue.updatedAt) {
          const created = issue.createdAt.toDate ? issue.createdAt.toDate() : new Date(issue.createdAt);
          const updated = issue.updatedAt.toDate ? issue.updatedAt.toDate() : new Date(issue.updatedAt);
          return sum + (updated - created);
        }
        return sum;
      }, 0);
      avgTimeToClose = Math.round(totalTime / closedIssues.length / (1000 * 60 * 60 * 24)); // Convert to days
    }

    // Issues created over time (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    const issuesByDay = last7Days.map(date => {
      const dayIssues = issues.filter(issue => {
        if (!issue.createdAt) return false;
        const created = issue.createdAt.toDate ? issue.createdAt.toDate() : new Date(issue.createdAt);
        return created.toDateString() === date.toDateString();
      });
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: dayIssues.length,
      };
    });

    return {
      total,
      byStatus,
      byPriority,
      avgTimeToClose,
      issuesByDay,
    };
  }, [issues]);

  // Chart data
  const statusData = [
    { name: 'Open', value: stats.byStatus.Open, color: '#3b82f6' },
    { name: 'In-Progress', value: stats.byStatus['In-Progress'], color: '#eab308' },
    { name: 'Review', value: stats.byStatus.Review, color: '#a855f7' },
    { name: 'Closed', value: stats.byStatus.Closed, color: '#22c55e' },
  ];

  const priorityData = [
    { name: 'Critical', value: stats.byPriority.Critical, color: '#ef4444' },
    { name: 'High', value: stats.byPriority.High, color: '#f97316' },
    { name: 'Medium', value: stats.byPriority.Medium, color: '#eab308' },
    { name: 'Low', value: stats.byPriority.Low, color: '#22c55e' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Overview of your issue tracking metrics</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Issues */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Issues</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Open Issues */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Issues</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.byStatus.Open}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-3">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.byStatus['In-Progress']}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Closed Issues */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Closed Issues</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.byStatus.Closed}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Priority Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Issues Created (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={stats.issuesByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Issues Created" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Time to Close</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {stats.avgTimeToClose > 0 ? `${stats.avgTimeToClose}d` : 'N/A'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Issues</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{stats.byPriority.Critical}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {stats.total > 0 ? `${Math.round((stats.byStatus.Closed / stats.total) * 100)}%` : '0%'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
