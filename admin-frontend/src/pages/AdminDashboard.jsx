import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Users, Activity, Layers } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [{ data: usersData }, { data: analyticsData }, { data: analysesData }] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', config),
          axios.get('http://localhost:5000/api/admin/analytics', config),
          axios.get('http://localhost:5000/api/admin/analyses', config)
        ]);
        setUsers(usersData);
        setAnalytics(analyticsData);
        setAnalyses(analysesData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAdminData();
  }, [user]);

  if (!analytics) return <div className="text-center p-20 dark:text-white">Loading Admin Panel...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold dark:text-white mb-8">Admin Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={analytics.totalUsers} icon={<Users size={24} />} color="text-primary-500" />
        <StatCard title="Total Analyses" value={analytics.totalAnalyses} icon={<Activity size={24} />} color="text-accent-green" />
        <StatCard title="System Load" value="Optimal" icon={<Layers size={24} />} color="text-accent-purple" />
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-dark-800/80">
          <h3 className="font-bold text-lg dark:text-white">Registered Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-dark-900/50 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined On</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="bg-white/30 dark:bg-dark-800/20 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-accent-purple/20 text-accent-purple' : 'bg-primary-500/20 text-primary-500'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-dark-800/80">
          <h3 className="font-bold text-lg dark:text-white">Analyses Performed</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-dark-900/50 dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">GitHub Username</th>
                <th className="px-6 py-4">Job Readiness</th>
                <th className="px-6 py-4">Overall Score</th>
                <th className="px-6 py-4">Date Performed</th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((a) => (
                <tr key={a._id} className="bg-white/30 dark:bg-dark-800/20 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{a.userId?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-primary-500">{a.githubUsername || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      a.jobReadiness === 'Ready to Hire' ? 'bg-accent-green/20 text-accent-green' : 
                      a.jobReadiness === 'Advanced' ? 'bg-accent-purple/20 text-accent-purple' : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {a.jobReadiness || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">{a.scores?.overall ? `${a.scores.overall}/100` : 'N/A'}</td>
                  <td className="px-6 py-4">{new Date(a.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass-panel p-6 flex items-center shadow-lg rounded-2xl">
    <div className={`p-4 rounded-xl bg-gray-100 dark:bg-dark-800 mr-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">{title}</p>
      <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
