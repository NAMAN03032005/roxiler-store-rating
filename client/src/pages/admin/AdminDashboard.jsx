import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Briefcase,
  ShieldCheck,
  Store,
  Star,
  BarChart3,
  UserPlus,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import StatCard from '../../components/common/StatCard';
import RatingStars from '../../components/rating/RatingStars';
import { useData } from '../../context/DataContext';

/**
 * Admin Dashboard View featuring Recharts Responsive Data Visualizations
 * (Ratings Over Time, Users By Role Donut, Store Rating Distribution Bar Chart)
 */
const AdminDashboard = () => {
  const { getAdminDashboardData, ratings, users } = useData();
  const stats = getAdminDashboardData();

  // 1. Data derivation for Ratings Over Time Line/Area Chart
  const timeSeriesData = useMemo(() => {
    const countsByDate = {};
    ratings.forEach((r) => {
      const dateKey = r.createdAt || '2026-02-20';
      countsByDate[dateKey] = (countsByDate[dateKey] || 0) + 1;
    });

    const sortedDates = Object.keys(countsByDate).sort();
    return sortedDates.map((date) => ({
      date,
      ratingsCount: countsByDate[date],
    }));
  }, [ratings]);

  // 2. Data derivation for Users by Role Donut Chart
  const roleChartData = useMemo(() => {
    const normalUsersCount = users.filter((u) => u.role === 'user').length;
    const storeOwnersCount = users.filter((u) => u.role === 'owner').length;
    const adminsCount = users.filter((u) => u.role === 'admin').length;

    return [
      { name: 'Normal Users', value: normalUsersCount, color: '#4f46e5' },
      { name: 'Store Owners', value: storeOwnersCount, color: '#f59e0b' },
      { name: 'Administrators', value: adminsCount, color: '#ef4444' },
    ];
  }, [users]);

  // 3. Data derivation for Store Rating Distribution Bar Chart
  const ratingDistributionData = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach((r) => {
      if (dist[r.rating] !== undefined) {
        dist[r.rating] += 1;
      }
    });

    return [
      { ratingLabel: '5 Stars', count: dist[5], fill: '#22c55e' },
      { ratingLabel: '4 Stars', count: dist[4], fill: '#6366f1' },
      { ratingLabel: '3 Stars', count: dist[3], fill: '#f59e0b' },
      { ratingLabel: '2 Stars', count: dist[2], fill: '#f97316' },
      { ratingLabel: '1 Star', count: dist[1], fill: '#ef4444' },
    ];
  }, [ratings]);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--gray-900)' }}>
          System Overview & Analytics
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Real-time user role counts, rating trends, and visual platform performance metrics.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="stats-grid">
        <StatCard label="Total Registered Users" value={stats.totalUsers} icon={Users} badgeText="Platform Accounts" />
        <StatCard label="Normal Users" value={stats.normalUsers} icon={UserCheck} badgeText="Customer Reviewers" />
        <StatCard label="Store Owners" value={stats.storeOwners} icon={Briefcase} badgeText="Merchant Managers" />
        <StatCard label="Administrators" value={stats.admins} icon={ShieldCheck} badgeText="System Admins" />
        <StatCard label="Total Stores" value={stats.totalStores} icon={Store} badgeText="Listed Businesses" />
        <StatCard label="Total Ratings" value={stats.totalRatings} icon={Star} badgeText="Submitted Reviews" />
        <StatCard label="Platform Avg Rating" value={`${stats.avgRating} / 5`} icon={BarChart3} badgeText="Overall Score" />
      </div>

      {/* Recharts Data Visualizations Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Chart A: Ratings Over Time */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--primary-600)" />
              Ratings Activity Over Time
            </h3>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRatings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <Area type="monotone" dataKey="ratingsCount" name="Ratings Submitted" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRatings)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Users by Role Donut Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="var(--primary-600)" />
              Users Distribution by Role
            </h3>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {roleChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart C: Store Rating Distribution Bar Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} color="var(--primary-600)" />
              Cumulative Rating Distribution
            </h3>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistributionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="ratingLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <Bar dataKey="count" name="Total Ratings" radius={[4, 4, 0, 0]}>
                  {ratingDistributionData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Administrative Tables & Quick Actions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Ratings Activity Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Platform Ratings</h3>
          </div>
          <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Store</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentRatingsList.length > 0 ? (
                  stats.recentRatingsList.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600 }}>{item.userName}</td>
                      <td>{item.storeName}</td>
                      <td>
                        <RatingStars value={item.rating} readOnly={true} size={15} />
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No ratings recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Platform Overview Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions & Health Summary</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Link to="/admin/users/new" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
              <UserPlus size={16} />
              <span>Add New System User</span>
            </Link>
            <Link to="/admin/stores/new" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
              <PlusCircle size={16} />
              <span>Add New Merchant Store</span>
            </Link>
            <Link to="/admin/users" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              <Users size={16} />
              <span>View & Manage All Users</span>
            </Link>
            <Link to="/admin/stores" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
              <Store size={16} />
              <span>View & Manage All Stores</span>
            </Link>
          </div>

          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '0.75rem' }}>
            Platform Summary
          </h4>
          <div style={{ padding: '0.875rem', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
              <span>Normal User Ratio:</span>
              <strong>{stats.totalUsers > 0 ? Math.round((stats.normalUsers / stats.totalUsers) * 100) : 0}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
              <span>Store Owner Ratio:</span>
              <strong>{stats.totalUsers > 0 ? Math.round((stats.storeOwners / stats.totalUsers) * 100) : 0}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Avg Ratings per Store:</span>
              <strong>{stats.totalStores > 0 ? (stats.totalRatings / stats.totalStores).toFixed(1) : '0.0'}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
