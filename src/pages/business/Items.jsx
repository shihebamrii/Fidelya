import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessApi } from '../../services/api';
import { Button, Input, Card, Modal, Spinner, Badge } from '../../components/ui';
import './Items.css';

const Items = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points: '',
    type: 'earn',
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['business-items'],
    queryFn: () => businessApi.getItems(),
  });

  const createMutation = useMutation({
    mutationFn: businessApi.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['business-items']);
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => businessApi.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['business-items']);
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: businessApi.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['business-items']);
    },
  });

  const items = data?.data?.items || [];
  const earnItems = items.filter(i => i.type === 'earn');
  const redeemItems = items.filter(i => i.type === 'redeem');

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || '',
        points: item.points.toString(),
        type: item.type,
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', description: '', points: '', type: 'earn' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ name: '', description: '', points: '', type: 'earn' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      description: formData.description,
      points: parseInt(formData.points),
      type: formData.type,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const renderItemCard = (item) => (
    <Card key={item._id} className="item-card">
      <div className="item-header">
        <Badge variant={item.type}>{item.type}</Badge>
        <span className="item-points">{item.points} pts</span>
      </div>
      <h3 className="item-name">{item.name}</h3>
      {item.description && <p className="item-description">{item.description}</p>}
      <div className="item-actions">
        <Button size="sm" variant="ghost" onClick={() => openModal(item)}>Edit</Button>
        <Button size="sm" variant="ghost" className="text-danger" onClick={() => deleteMutation.mutate(item._id)}>Delete</Button>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="items-page animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">Items</h1>
          <p className="page-subtitle">Manage your earn and redeem items</p>
        </div>
        <Button onClick={() => openModal()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Item
        </Button>
      </div>

      {/* Earn Items */}
      <div className="items-section">
        <h2 className="section-title">
          <span className="section-dot section-dot-success"></span>
          Earn Items ({earnItems.length})
        </h2>
        {earnItems.length === 0 ? (
          <Card>
            <div className="empty-state">
              <p className="text-gray-500">No earn items yet</p>
            </div>
          </Card>
        ) : (
          <div className="items-grid">
            {earnItems.map(renderItemCard)}
          </div>
        )}
      </div>

      {/* Redeem Items */}
      <div className="items-section">
        <h2 className="section-title">
          <span className="section-dot section-dot-danger"></span>
          Redeem Items ({redeemItems.length})
        </h2>
        {redeemItems.length === 0 ? (
          <Card>
            <div className="empty-state">
              <p className="text-gray-500">No redeem items yet</p>
            </div>
          </Card>
        ) : (
          <div className="items-grid">
            {redeemItems.map(renderItemCard)}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingItem ? 'Edit Item' : 'Add Item'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Input
              label="Name"
              placeholder="e.g., Coffee Purchase"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Points"
              type="number"
              placeholder="10"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: e.target.value })}
              required
            />
            <div className="input-group">
              <label className="input-label">Type</label>
              <div className="type-selector">
                <button
                  type="button"
                  className={`type-btn ${formData.type === 'earn' ? 'type-btn-active type-btn-earn' : ''}`}
                  onClick={() => setFormData({ ...formData, type: 'earn' })}
                >
                  Earn
                </button>
                <button
                  type="button"
                  className={`type-btn ${formData.type === 'redeem' ? 'type-btn-active type-btn-redeem' : ''}`}
                  onClick={() => setFormData({ ...formData, type: 'redeem' })}
                >
                  Redeem
                </button>
              </div>
            </div>
            <Input
              label="Description (optional)"
              placeholder="Describe this item"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Items;
