import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Card, Spinner, Badge } from '../../components/ui';

const AdminTransactions = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-all-transactions'],
    queryFn: () => adminApi.getTransactions({ limit: 100 }),
  });

  const transactions = data?.data?.transactions || [];

  return (
    <div className="transactions-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <p className="page-subtitle">All transactions across the platform</p>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner size="lg" />
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
                  <th>Date</th>
                  <th>Client</th>
                  <th>Business</th>
                  <th>Item</th>
                  <th>Performed By</th>
                  <th>Points</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                    <td className="font-medium">{tx.clientId?.name || tx.clientId?.clientId || '-'}</td>
                    <td>{tx.businessId?.name || '-'}</td>
                    <td>
                      {tx.itemId ? (
                        <Badge variant={tx.itemId.type === 'earn' ? 'earn' : 'redeem'}>
                          {tx.itemId.name}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">Manual</span>
                      )}
                    </td>
                    <td>
                      <span className={tx.points >= 0 ? 'text-success font-semibold' : 'text-danger font-semibold'}>
                        {tx.points >= 0 ? '+' : ''}{tx.points}
                      </span>
                    </td>
                    <td>
                      {tx.beforePoints} → {tx.afterPoints}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminTransactions;
