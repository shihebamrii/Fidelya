import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Card, Spinner } from '../../components/ui';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { data: businessesData, isLoading: businessesLoading } = useQuery({
    queryKey: ['admin-businesses'],
    queryFn: () => adminApi.getBusinesses({ limit: 5 }),
  });

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: () => adminApi.getTransactions({ limit: 10 }),
  });

  const businesses = businessesData?.data?.businesses || [];
  const transactions = transactionsData?.data?.transactions || [];
  const totalBusinesses = businessesData?.data?.pagination?.total || 0;
  const totalTransactions = transactionsData?.data?.pagination?.total || 0;

  return (
    <div className="admin-dashboard animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your loyalty platform</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Businesses</span>
            <span className="stat-value">{totalBusinesses}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Transactions</span>
            <span className="stat-value">{totalTransactions}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Active Today</span>
            <span className="stat-value">-</span>
          </div>
        </div>
      </div>

      {/* Recent Businesses */}
      <Card className="mb-6">
        <Card.Header>
          <Card.Title>Recent Businesses</Card.Title>
        </Card.Header>
        <Card.Content>
          {businessesLoading ? (
            <div className="flex justify-center p-8">
              <Spinner />
            </div>
          ) : businesses.length === 0 ? (
            <div className="empty-state">
              <p className="text-gray-500">No businesses yet</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>City</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((business) => (
                    <tr key={business._id}>
                      <td className="font-medium">{business.name}</td>
                      <td>{business.category || '-'}</td>
                      <td>{business.city || '-'}</td>
                      <td>{new Date(business.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <Card.Header>
          <Card.Title>Recent Transactions</Card.Title>
        </Card.Header>
        <Card.Content>
          {transactionsLoading ? (
            <div className="flex justify-center p-8">
              <Spinner />
            </div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Business</th>
                    <th>Points</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id}>
                      <td>{tx.clientId?.name || tx.clientId?.clientId || '-'}</td>
                      <td>{tx.businessId?.name || '-'}</td>
                      <td>
                        <span className={tx.points >= 0 ? 'text-success' : 'text-danger'}>
                          {tx.points >= 0 ? '+' : ''}{tx.points}
                        </span>
                      </td>
                      <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default AdminDashboard;
