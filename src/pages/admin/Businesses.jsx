import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { Button, Input, Card, Modal, Spinner } from '../../components/ui';
import './Businesses.css';

const Businesses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    city: '',
    contactEmail: '',
    activationCode: '',
  });
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-businesses', searchQuery],
    queryFn: () => adminApi.getBusinesses({ q: searchQuery, limit: 50 }),
  });

  const createMutation = useMutation({
    mutationFn: adminApi.createBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-businesses']);
      setIsModalOpen(false);
      setFormData({ name: '', category: '', city: '', contactEmail: '', activationCode: '' });
    },
    onError: (error) => {
      setFormError(error.response?.data?.message || 'Failed to create business');
    },
  });

  const businesses = data?.data?.businesses || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    createMutation.mutate(formData);
  };

  return (
    <div className="businesses-page animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">Businesses</h1>
          <p className="page-subtitle">Manage all businesses on the platform</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Business
        </Button>
      </div>

      {/* Search */}
      <div className="search-bar mb-6">
        <Input
          placeholder="Search businesses..."
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

      {/* Businesses Grid */}
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Spinner size="lg" />
        </div>
      ) : businesses.length === 0 ? (
        <Card>
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h3 className="empty-state-title">No businesses yet</h3>
            <p className="empty-state-text">Create your first business to get started</p>
            <Button onClick={() => setIsModalOpen(true)}>Add Business</Button>
          </div>
        </Card>
      ) : (
        <div className="businesses-grid">
          {businesses.map((business) => (
            <Card
              key={business._id}
              hover
              onClick={() => navigate(`/admin/businesses/${business._id}`)}
              className="business-card"
            >
              <div className="business-avatar">
                {business.name.charAt(0)}
              </div>
              <h3 className="business-name">{business.name}</h3>
              <p className="business-info">
                {business.category && <span>{business.category}</span>}
                {business.city && <span> • {business.city}</span>}
              </p>
              <p className="business-date">
                Created {new Date(business.createdAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Business"
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <div className="form-error mb-4">{formError}</div>
          )}
          <div className="form-grid">
            <Input
              label="Business Name"
              placeholder="Enter business name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Category"
              placeholder="e.g., Cafe, Retail"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <Input
              label="City"
              placeholder="Enter city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <Input
              label="Contact Email"
              type="email"
              placeholder="contact@business.com"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            />
            <Input
              label="Activation Code"
              placeholder="Assign a generic code (e.g., 2024)"
              value={formData.activationCode}
              onChange={(e) => setFormData({ ...formData, activationCode: e.target.value })}
            />
          </div>
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={createMutation.isPending}>
              Create Business
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Businesses;
