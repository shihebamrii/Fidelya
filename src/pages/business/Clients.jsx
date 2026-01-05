import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { businessApi } from '../../services/api';
import { Input, Card, Spinner, Badge, Button } from '../../components/ui';
import QRScannerModal from '../../components/QRScannerModal';

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['business-clients', searchQuery],
    queryFn: () => businessApi.searchClients({ q: searchQuery || '', limit: 50 }),
  });

  const clients = data?.data?.clients || [];

  const handleScanSuccess = (clientId) => {
    navigate(`/business/clients/${clientId}`);
  };

  return (
    <div className="clients-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Clients</h1>
        <p className="page-subtitle">Search and manage your clients</p>
      </div>

      <div className="flex items-center gap-3 mb-6" style={{ maxWidth: '450px' }}>
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Search by name, phone, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            }
          />
        </div>
        <Button 
          variant="secondary" 
          onClick={() => setIsScannerOpen(true)}
          style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Scan QR Code"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </Button>
      </div>

      <QRScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScanSuccess={handleScanSuccess}
      />

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Spinner size="lg" />
        </div>
      ) : clients.length === 0 ? (
        <Card>
          <div className="empty-state">
            <p className="text-gray-500">
              {searchQuery ? 'No clients found matching your search' : 'No clients yet'}
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="table-wrapper">
            {/* Desktop Table View */}
            <div className="table-container hidden-mobile">
              <table className="table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Contact</th>
                    <th>Points</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr 
                      key={client._id} 
                      onClick={() => navigate(`/business/clients/${client.clientId}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--color-primary-bg)',
                            color: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            fontSize: 'var(--font-size-sm)'
                          }}>
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
                              {client.clientId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{client.phone || '-'}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
                          {client.email || ''}
                        </div>
                      </td>
                      <td>
                        <Badge variant="primary">{client.points} pts</Badge>
                      </td>
                      <td>{new Date(client.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-list show-mobile">
              {clients.map((client) => (
                <div 
                  key={client._id} 
                  className="mobile-client-card"
                  onClick={() => navigate(`/business/clients/${client.clientId}`)}
                >
                  <div className="mobile-client-avatar">
                    {client.name.charAt(0)}
                  </div>
                  <div className="mobile-client-info">
                    <div className="font-bold">{client.name}</div>
                    <div className="text-xs text-gray-500">{client.phone || client.email || client.clientId}</div>
                  </div>
                  <div className="mobile-client-points">
                    <Badge variant="primary" size="sm">{client.points} pts</Badge>
                  </div>
                  <div className="mobile-client-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Clients;
