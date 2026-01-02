import { useQuery } from '@tanstack/react-query';
import { businessApi } from '../../services/api';
import { Card, Spinner, Badge } from '../../components/ui';

const BusinessTransactions = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['business-all-transactions'],
    queryFn: () => businessApi.getTransactions({ limit: 100 }),
  });

  const transactions = data?.data?.transactions || [];

  return (
    <div className="transactions-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <p className="page-subtitle">View all transactions for your business</p>
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
                  <th>Item</th>
                  <th>Points</th>
                  <th>Balance</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
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
                    <td>
                      {tx.beforePoints} → {tx.afterPoints}
                    </td>
                    <td className="text-gray-500">{tx.note || '-'}</td>
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

export default BusinessTransactions;
