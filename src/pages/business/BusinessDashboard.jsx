import { useQuery } from '@tanstack/react-query';
import { businessApi } from '../../services/api';
import { Card, Spinner, Badge } from '../../components/ui';
import './BusinessDashboard.css';

const BusinessDashboard = () => {
  const { data: itemsData, isLoading: itemsLoading } = useQuery({
    queryKey: ['business-items'],
    queryFn: () => businessApi.getItems(),
  });

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['business-transactions'],
    queryFn: () => businessApi.getTransactions({ limit: 10 }),
  });

  const items = itemsData?.data?.items || [];
  const transactions = transactionsData?.data?.transactions || [];
  
  const earnItems = items.filter(i => i.type === 'earn');
  const redeemItems = items.filter(i => i.type === 'redeem');

  return (
    <div className="business-dashboard animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's what's happening today</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card glass animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="stat-icon bg-gradient-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Earn Items</span>
            <span className="stat-value">{earnItems.length}</span>
          </div>
        </div>

        <div className="stat-card glass animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="stat-icon bg-gradient-danger">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Redeem Items</span>
            <span className="stat-value">{redeemItems.length}</span>
          </div>
        </div>

        <div className="stat-card glass animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="stat-icon bg-gradient-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-label">Daily Reach</span>
            <span className="stat-value">{transactions.length}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-header">
        <h2 className="section-title">Quick Actions</h2>
      </div>
      <div className="quick-actions mb-8">
        <Card className="action-card card-hover" onClick={() => window.location.href = '/business/points'}>
          <div className="action-icon action-icon-success">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <div className="action-info">
            <h3>Add Points</h3>
            <p>Reward loyal clients instantly</p>
          </div>
        </Card>

        <Card className="action-card card-hover" onClick={() => window.location.href = '/business/clients'}>
          <div className="action-icon action-icon-primary">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <div className="action-info">
            <h3>Find Client</h3>
            <p>Access client history & profile</p>
          </div>
        </Card>

        <Card className="action-card card-hover" onClick={() => window.location.href = '/business/items'}>
          <div className="action-icon action-icon-warning">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="action-info">
            <h3>Manage Items</h3>
            <p>Configure rewards & offers</p>
          </div>
        </Card>
      </div>

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
            <div className="table-wrapper">
              {/* Desktop Table */}
              <div className="table-container hidden-mobile">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Item</th>
                      <th>Points</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx._id}>
                        <td className="font-medium">{tx.clientId?.name || tx.clientId?.clientId}</td>
                        <td>
                          {tx.itemId ? (
                            <Badge variant={tx.itemId.type}>{tx.itemId.name}</Badge>
                          ) : (
                            <span className="text-gray-400">Manual</span>
                          )}
                        </td>
                        <td>
                          <span className={tx.points >= 0 ? 'text-success font-semibold' : 'text-danger font-semibold'}>
                            {tx.points >= 0 ? '+' : ''}{tx.points}
                          </span>
                        </td>
                        <td>{new Date(tx.createdAt).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile List Cards */}
              <div className="mobile-list show-mobile">
                {transactions.map((tx) => (
                  <div key={tx._id} className="mobile-tx-card">
                    <div className="mobile-tx-info">
                      <div className="font-semibold">{tx.clientId?.name || tx.clientId?.clientId}</div>
                      <div className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleTimeString()}</div>
                    </div>
                    <div className="mobile-tx-item">
                      {tx.itemId ? (
                        <Badge variant={tx.itemId.type} size="sm">{tx.itemId.name}</Badge>
                      ) : (
                        <span className="text-xs text-gray-400">Manual</span>
                      )}
                    </div>
                    <div className={`mobile-tx-points ${tx.points >= 0 ? 'text-success' : 'text-danger'} font-bold`}>
                      {tx.points >= 0 ? '+' : ''}{tx.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default BusinessDashboard;
