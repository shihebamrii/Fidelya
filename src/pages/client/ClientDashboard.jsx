import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { clientApi } from '../../services/api';
import { Spinner } from '../../components/ui';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const { businessSlug, clientId } = useParams();
  const [activeTab, setActiveTab] = useState('offers'); 
  const [showQR, setShowQR] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['client-dashboard', businessSlug, clientId],
    queryFn: () => clientApi.getDashboard(businessSlug, clientId),
    retry: false
  });

  const { data: qrData } = useQuery({
    queryKey: ['client-qr', businessSlug, clientId],
    queryFn: () => clientApi.getQR(businessSlug, clientId),
    enabled: !!data,
  });

  // Debugging Log
  useEffect(() => {
    if (data) console.log('Dashboard Data:', data);
    if (error) console.error('Dashboard Error:', error);
  }, [data, error]);

  if (isLoading) return <div className="client-page"><div className="client-loading"><Spinner size="lg" /></div></div>;
  if (error) return <div className="client-page"><div className="client-error">Card Not Found</div></div>;

  // Safely extract data with defaults
  const dashboardData = data?.data || {};
  const client = dashboardData.client || {};
  const availableRewards = Array.isArray(dashboardData.availableRewards) ? dashboardData.availableRewards : [];
  const rawTransactions = Array.isArray(dashboardData.transactions) ? dashboardData.transactions : [];

  // Calculate Progress towards next reward
  const currentPoints = client?.points || 0;
  // Find first reward that costs more than current points
  const nextReward = availableRewards.sort((a,b) => a.points - b.points).find(r => r.points > currentPoints);
  
  let progressPercent = 100;
  let nextGoalText = "All rewards unlocked!";

  if (nextReward) {
      progressPercent = Math.min(100, Math.max(0, (currentPoints / nextReward.points) * 100));
      nextGoalText = `Next: ${nextReward.name} (${nextReward.points - currentPoints} left)`;
  } else if (availableRewards.length === 0) {
      progressPercent = 0;
      nextGoalText = "No rewards active";
  }

  // Safe History Logic
  const mappedHistory = rawTransactions.map(tx => {
    try {
      let dateStr = 'Unknown Date';
      if (tx.createdAt) {
          const d = new Date(tx.createdAt);
          if (!isNaN(d.getTime())) {
              dateStr = d.toLocaleDateString(undefined, {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });
          }
      }

      return {
        id: tx._id || Math.random(), // Fallback ID
        type: (tx.points || 0) > 0 ? 'gained' : 'redeemed',
        label: tx.itemId?.name || tx.note || ((tx.points || 0) > 0 ? 'Points Earned' : 'Redemption'),
        date: dateStr,
        amount: tx.points || 0
      };
    } catch (err) {
      console.warn('Error mapping transaction:', err, tx);
      return null;
    }
  }).filter(Boolean); // Remove failed items

  const filteredHistory = mappedHistory.filter(item => {
    if (activeTab === 'gained') return item.type === 'gained';
    if (activeTab === 'redeemed') return item.type === 'redeemed';
    return false;
  });

  return (
    <div className="client-page">
        <div className="app-shell">
            
            <header className="app-header">
                <div className="user-profile">
                    <div className="avatar">
                        {client?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-col">
                        <span className="welcome">Welcome back,</span>
                        <span className="username">{client?.name || 'Valued Member'}</span>
                    </div>
                </div>
                <button className="qr-btn" onClick={() => setShowQR(true)} aria-label="Show QR Code">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4h-4v-2h-3v4h3v-4h4v0m0-4v4m0 0h6m-6 0H9m-2 0H3m2-6h2a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2zm10-6h2a2 2 0 002-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2zm-12 8h2a2 2 0 002-2v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2z" /></svg>
                </button>
            </header>

            <div className="px-4 mb-6">
                <div className="balance-card">
                    <div className="mesh-bg"></div>
                    <div className="card-content">
                        <span className="lbl">Current Points</span>
                        <div className="pts">{client?.points || 0}</div>
                        <div className="progress-container">
                            <div className="progress-bar" style={{width: `${progressPercent}%`}}></div>
                        </div>
                        <div className="card-footer">
                            <span className="badge">Platinum</span>
                            <span className="next-goal">{nextGoalText}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="nav-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('offers')}
                >
                    <span className="icon">🎁</span>
                    Offers
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'gained' ? 'active' : ''}`}
                    onClick={() => setActiveTab('gained')}
                >
                    <span className="icon">📈</span>
                    Gained
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'redeemed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('redeemed')}
                >
                    <span className="icon">📉</span>
                    Redeemed
                </button>
            </div>

            <div className="content-area">
                
                {activeTab === 'offers' && (
                    <div className="offers-grid">
                        <h3 className="section-title">Redeem Rewards</h3>
                        {availableRewards.length > 0 ? (
                            availableRewards.map((reward, idx) => {
                                const canRedeem = (client?.points || 0) >= reward.points;
                                return (
                                    <div key={reward._id || idx} className={`offer-card ${canRedeem ? 'unlock' : 'lock'}`}>
                                        <div className="offer-icon">🎉</div>
                                        <div className="offer-details">
                                            <h4>{reward.name}</h4>
                                            <p>{reward.description || 'Unlock this special reward.'}</p>
                                        </div>
                                        <div className="offer-action">
                                            <span className="cost">{reward.points} pts</span>
                                            {canRedeem && <button className="redeem-sm">Get</button>}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="empty-state">
                                No offers available right now.
                            </div>
                        )}
                    </div>
                )}

                {(activeTab === 'gained' || activeTab === 'redeemed') && (
                    <div className="history-list">
                        <h3 className="section-title">
                            {activeTab === 'gained' ? 'Points Earned' : 'Redemption History'}
                        </h3>
                        {filteredHistory.length > 0 ? (
                            filteredHistory.map((item, idx) => (
                                <div key={item.id || idx} className="history-item">
                                    <div className={`h-icon ${item.type}`}>
                                        {item.type === 'gained' ? '⚡' : '🛍️'}
                                    </div>
                                    <div className="h-info">
                                        <span className="h-lbl">{item.label}</span>
                                        <span className="h-date">{item.date}</span>
                                    </div>
                                    <div className={`h-val ${item.type}`}>
                                        {item.amount > 0 ? '+' : ''}{item.amount}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                {activeTab === 'gained' 
                                    ? "You haven't earned any points yet." 
                                    : "You haven't redeemed any rewards yet."}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showQR && (
                <div className="qr-overlay" onClick={() => setShowQR(false)}>
                    <div className="qr-sheet" onClick={e => e.stopPropagation()}>
                        <div className="drag-handle"></div>
                        <h3>Member Code</h3>
                        <div className="qr-img-box">
                            {qrData?.data?.qrDataUrl && <img src={qrData.data.qrDataUrl} alt="QR" />}
                        </div>
                        <p className="code-txt">{clientId}</p>
                        <button className="close-btn" onClick={() => setShowQR(false)}>Close</button>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

export default ClientDashboard;
