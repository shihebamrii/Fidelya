import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { businessApi } from '../../services/api';
import { Button, Input, Card, Spinner, Badge } from '../../components/ui';
import QRScannerModal from '../../components/QRScannerModal';
import './Points.css';

const Points = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [note, setNote] = useState('');
  const [result, setResult] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const { data: itemsData } = useQuery({
    queryKey: ['business-items'],
    queryFn: () => businessApi.getItems(),
  });

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ['client-search', searchQuery],
    queryFn: () => businessApi.searchClients({ q: searchQuery }),
    enabled: searchQuery.length >= 2,
  });

  const pointsMutation = useMutation({
    mutationFn: ({ clientId, data }) => businessApi.addPoints(clientId, data),
    onSuccess: (response) => {
      setResult(response.data);
    },
  });

  const items = itemsData?.data?.items || [];
  const clients = searchData?.data?.clients || [];

  const handleAddPoints = () => {
    if (!selectedClient || !selectedItem) return;
    
    pointsMutation.mutate({
      clientId: selectedClient.clientId,
      data: {
        itemId: selectedItem._id,
        note: note || undefined,
      },
    });
  };

  const reset = () => {
    setSelectedClient(null);
    setSelectedItem(null);
    setNote('');
    setResult(null);
    setSearchQuery('');
  };

  if (result) {
    return (
      <div className="points-page animate-fade-in">
        <Card className="result-card">
          <div className="result-icon result-icon-success">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="result-title">Transaction Complete!</h2>
          <div className="result-details">
            <p><strong>{selectedClient.name}</strong></p>
            <p className="result-points">
              <span className={result.pointsChange >= 0 ? 'text-success' : 'text-danger'}>
                {result.pointsChange >= 0 ? '+' : ''}{result.pointsChange} points
              </span>
            </p>
            <p className="result-balance">
              New balance: <strong>{result.afterPoints} pts</strong>
            </p>
          </div>
          <Button onClick={reset} fullWidth>New Transaction</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="points-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Add/Deduct Points</h1>
        <p className="page-subtitle">Select a client and item to process a transaction</p>
      </div>

      <div className="points-flow">
        {/* Step 1: Select Client */}
        <Card className="step-card">
          <h3 className="step-title">
            <span className="step-number">1</span>
            Select Client
          </h3>
          
          {selectedClient ? (
            <div className="selected-item">
              <div className="selected-info">
                <span className="selected-name">{selectedClient.name}</span>
                <span className="selected-meta">{selectedClient.clientId} • {selectedClient.points} pts</span>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedClient(null)}>Change</Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div style={{ flex: 1 }}>
                  <Input
                    placeholder="Search by name, phone, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                      </svg>
                    }
                  />
                </div>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsScannerOpen(true)}
                  style={{ height: '48px', width: '48px', padding: 0 }}
                  title="Scan QR Code"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </Button>
              </div>

              <QRScannerModal 
                isOpen={isScannerOpen} 
                onClose={() => setIsScannerOpen(false)} 
                onScanSuccess={(clientId) => {
                  setSearchQuery(clientId);
                }}
              />
              
              {searchLoading && <div className="p-4 flex justify-center"><Spinner /></div>}
              
              {clients.length > 0 && (
                <div className="search-results">
                  {clients.map((client) => (
                    <div
                      key={client._id}
                      className="search-result-item animate-fade-in-scale"
                      onClick={() => setSelectedClient(client)}
                    >
                      <div className="result-avatar">{client.name.charAt(0)}</div>
                      <div className="result-info">
                        <span className="result-name">{client.name}</span>
                        <span className="result-id">{client.clientId}</span>
                      </div>
                      <Badge variant="primary">{client.points} pts</Badge>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Card>

        {/* Step 2: Select Item */}
        <Card className="step-card">
          <h3 className="step-title">
            <span className="step-number">2</span>
            Select Item
          </h3>
          
          {selectedItem ? (
            <div className="selected-item">
              <div className="selected-info">
                <span className="selected-name">{selectedItem.name}</span>
                <span className={`selected-points ${selectedItem.type === 'earn' ? 'text-success' : 'text-danger'}`}>
                  {selectedItem.type === 'earn' ? '+' : '-'}{selectedItem.points} pts
                </span>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setSelectedItem(null)}>Change</Button>
            </div>
          ) : (
            <div className="items-list">
              {items.map((item) => (
                <div
                  key={item._id}
                  className={`item-option ${item.type}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="item-option-info">
                    <Badge variant={item.type} size="sm">{item.type}</Badge>
                    <span className="item-option-name">{item.name}</span>
                  </div>
                  <span className={`item-option-points ${item.type === 'earn' ? 'text-success' : 'text-danger'}`}>
                    {item.type === 'earn' ? '+' : '-'}{item.points}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Step 3: Confirm */}
        <Card className="step-card">
          <h3 className="step-title">
            <span className="step-number">3</span>
            Confirm
          </h3>
          
          <Input
            label="Note (optional)"
            placeholder="Add a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          
          <Button
            onClick={handleAddPoints}
            fullWidth
            size="lg"
            className="mt-4"
            disabled={!selectedClient || !selectedItem}
            loading={pointsMutation.isPending}
          >
            {selectedItem?.type === 'earn' ? 'Add Points' : 'Deduct Points'}
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Points;
