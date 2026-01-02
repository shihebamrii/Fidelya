import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Button, Input, Card, Modal, Spinner, Badge } from '../../components/ui';
import './BusinessDetail.css';

const BusinessDetail = () => {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('clients');

  const [userForm, setUserForm] = useState({ email: '', password: '', name: '' }); 
  // reusing userForm for create/edit. For edit, password is optional.
  const [clientForm, setClientForm] = useState({ name: '', phone: '', email: '', initialPoints: 0 });
  const [editForm, setEditForm] = useState({ name: '', category: '', city: '', contactEmail: '' });
  const [bulkCount, setBulkCount] = useState(50);
  const [generationResult, setGenerationResult] = useState(null);
  const [qrData, setQrData] = useState(null);

  const { data: businessData, isLoading: businessLoading } = useQuery({
    queryKey: ['admin-business', businessId],
    queryFn: () => adminApi.getBusiness(businessId),
  });

  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ['admin-clients', businessId],
    queryFn: () => adminApi.getClients(businessId, { limit: 50 }),
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', businessId],
    queryFn: () => adminApi.getBusinessUsers(businessId),
  });

  const updateBusinessMutation = useMutation({
    mutationFn: (data) => adminApi.updateBusiness(businessId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-business', businessId]);
      setEditModalOpen(false);
    },
  });

  const deleteBusinessMutation = useMutation({
    mutationFn: () => adminApi.deleteBusiness(businessId),
    onSuccess: () => {
      navigate('/admin/businesses');
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (data) => adminApi.createBusinessUser(businessId, data),
    onSuccess: () => {
      setUserModalOpen(false);
      setUserForm({ email: '', password: '', name: '' });
      queryClient.invalidateQueries(['admin-users', businessId]);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (data) => adminApi.updateBusinessUser(businessId, selectedUser._id, data),
    onSuccess: () => {
      setEditUserModalOpen(false);
      setSelectedUser(null);
      setUserForm({ email: '', password: '', name: '' });
      queryClient.invalidateQueries(['admin-users', businessId]);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId) => adminApi.deleteBusinessUser(businessId, userId),
    onSuccess: () => {
      setDeleteUserModalOpen(false);
      setSelectedUser(null);
      queryClient.invalidateQueries(['admin-users', businessId]);
    },
  });

  const createClientMutation = useMutation({
    mutationFn: (data) => adminApi.createClient(businessId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['admin-clients', businessId]);
      setQrData(response.data);
    },
  });

  const generateClientsMutation = useMutation({
    mutationFn: (count) => adminApi.generateClients(businessId, { count }),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['admin-clients', businessId]);
      setGenerationResult({
        count: response.data.count,
        message: response.data.message
      });
      setBulkModalOpen(false);
      setBulkCount(50);
    },
  });

  // Pre-fill edit form when data is loaded (or when modal opens)
  const handleOpenEdit = () => {
    if (businessData?.data?.business) {
      const b = businessData.data.business;
      setEditForm({
        name: b.name || '',
        category: b.category || '',
        city: b.city || '',
        contactEmail: b.contactEmail || ''
      });
      setEditModalOpen(true);
    }
  };

  const business = businessData?.data?.business;
  const clients = clientsData?.data?.clients || [];
  const users = usersData?.data?.users || [];

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '' // Don't fill password
    });
    setEditUserModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteUserModalOpen(true);
  };

  if (businessLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="empty-state">
        <h3>Business not found</h3>
        <Button onClick={() => navigate('/admin/businesses')}>Back to Businesses</Button>
      </div>
    );
  }

  return (
    <div className="business-detail animate-fade-in">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/admin/businesses')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="page-title">{business.name}</h1>
        <p className="page-subtitle">
          {business.category && <span>{business.category}</span>}
          {business.city && <span> • {business.city}</span>}
        </p>
      </div>

      {/* Actions */}
      <div className="action-buttons mb-6">
        <Button onClick={() => setUserModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <path d="M20 8v6M23 11h-6" />
          </svg>
          Add Employee
        </Button>
        <Button variant="success" onClick={() => setClientModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Client
        </Button>
        <Button variant="secondary" className="ml-2" onClick={() => setBulkModalOpen(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Bulk Generate
        </Button>
        <Button variant="outline" className="ml-2" onClick={() => navigate(`/admin/businesses/${businessId}/design`)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit Design
        </Button>
        <Button variant="outline" className="ml-2" onClick={handleOpenEdit}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
             </svg>
             Edit Details
        </Button>
        <Button variant="danger" className="ml-2" onClick={() => setDeleteModalOpen(true)}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
             </svg>
             Delete
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'clients' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('clients')}
        >
          Clients ({clients.length})
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'employees' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('employees')}
        >
          Employees ({users.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'clients' ? (
        <Card>
          <Card.Header>
            <Card.Title>Clients List</Card.Title>
          </Card.Header>
          <Card.Content>
            {clientsLoading ? (
              <div className="flex justify-center p-8">
                <Spinner />
              </div>
            ) : clients.length === 0 ? (
              <div className="empty-state">
                <p className="text-gray-500">No clients yet</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Client ID</th>
                      <th>Name</th>
                      <th>Points</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client._id}>
                        <td className="font-mono">
                          <span 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (business?.slug) {
                                  window.open(`/${business.slug}/client/${client.clientId}`, '_blank');
                              } else {
                                  alert("Business slug missing. Please refresh or contact support.");
                              }
                            }}
                            className="text-primary hover:underline cursor-pointer inline-flex items-center gap-1"
                            title="Open Client Dashboard"
                          >
                            {client.clientId}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </span>
                        </td>
                        <td>{client.name || 'N/A'}</td>
                        <td>
                          <Badge variant={client.points > 0 ? 'success' : 'neutral'}>
                            {client.points} pts
                          </Badge>
                        </td>
                        <td className="text-sm text-gray-500">
                          {new Date(client.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Content>
        </Card>
      ) : (
        <Card>
          <Card.Header>
            <Card.Title>Employees List</Card.Title>
          </Card.Header>
          <Card.Content>
            {usersLoading ? (
              <div className="flex justify-center p-8">
                <Spinner />
              </div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <p className="text-gray-500">No employees added yet.</p>
                <Button variant="outline" size="sm" onClick={() => setUserModalOpen(true)} className="mt-4"> Add First Employee </Button>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="font-medium">{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEditUser(user)}>Edit</Button>
                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteUser(user)}>Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Content>
        </Card>
      )}

      {/* MODALS */}
      
      {/* Edit Business Details Modal */}
      <Modal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)}
        title="Edit Business Details"
      >
        <div className="space-y-4">
          <Input 
            label="Business Name"
            value={editForm.name}
            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input 
            label="Category"
            value={editForm.category}
            onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
          />
          <Input 
            label="City"
            value={editForm.city}
            onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
          />
           <Input 
            label="Contact Email"
            type="email"
            value={editForm.contactEmail}
            onChange={(e) => setEditForm(prev => ({ ...prev, contactEmail: e.target.value }))}
          />
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button 
               onClick={() => updateBusinessMutation.mutate(editForm)}
               disabled={updateBusinessMutation.isPending}
            >
              {updateBusinessMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="p-4">
           <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4 border border-red-200">
              <p className="font-bold">Warning: This action cannot be undone.</p>
              <p className="text-sm mt-1">
                 This will permanently delete <strong>{business?.name}</strong> and all associated data,
                 including <strong>{clients.length} clients</strong> and their transactions.
              </p>
           </div>
           
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button 
               variant="danger"
               onClick={() => deleteBusinessMutation.mutate()}
               disabled={deleteBusinessMutation.isPending}
            >
              {deleteBusinessMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* User Modal */}
      <Modal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        title="Add Business User"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            value={userForm.password}
            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setUserModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createUserMutation.mutate(userForm)}
              disabled={createUserMutation.isPending}
            >
              Add User
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Client Modal */}
      <Modal
         isOpen={clientModalOpen}
         onClose={() => { setClientModalOpen(false); setQrData(null); }}
         title={qrData ? "Client Created!" : "Add New Client"}
      >
         {qrData ? (
             <div className="flex flex-col items-center justify-center p-4">
                 <p className="text-green-600 font-bold mb-4">Client created successfully!</p>
                 <img src={qrData.qrDataUrl} alt="Client QR" className="border p-2 rounded-lg shadow-sm" style={{ width: 200, height: 200 }} />
                 <p className="text-sm text-gray-500 mt-2">ID: {qrData.client?.clientId}</p>
                 <Button className="mt-6" onClick={() => { setClientModalOpen(false); setQrData(null); }}>Done</Button>
             </div>
         ) : (
            <div className="space-y-4">
               <Input
                  label="Name (Optional)"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
               />
               <Input
                  label="Phone (Optional)"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
               />
               <Input
                  label="Email (Optional)"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
               />
               <Input
                  label="Initial Points"
                  type="number"
                  value={clientForm.initialPoints}
                  onChange={(e) => setClientForm({ ...clientForm, initialPoints: parseInt(e.target.value) || 0 })}
               />
               <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setClientModalOpen(false)}>Cancel</Button>
                  <Button
                     onClick={() => createClientMutation.mutate(clientForm)}
                     disabled={createClientMutation.isPending}
                  >
                     Create Client
                  </Button>
               </div>
            </div>
         )}
      </Modal>

      {/* Bulk Generate Modal */}
      <Modal
         isOpen={bulkModalOpen}
         onClose={() => setBulkModalOpen(false)}
         title="Bulk Generate Clients"
      >
         <div className="space-y-4">
            <p className="text-sm text-gray-600">
               Generate multiple client accounts instantly. They will be assigned sequential IDs (e.g., client1, client2).
            </p>
            <Input
               label="Number of Clients to Generate"
               type="number"
               min="1"
               max="1000"
               value={bulkCount}
               onChange={(e) => setBulkCount(parseInt(e.target.value) || 0)}
            />
            {generationResult && (
               <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
                  {generationResult.message}
               </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
               <Button variant="outline" onClick={() => setBulkModalOpen(false)}>Cancel</Button>
               <Button
                  onClick={() => generateClientsMutation.mutate(bulkCount)}
                  disabled={generateClientsMutation.isPending}
               >
                  {generateClientsMutation.isPending ? 'Generating...' : 'Generate'}
               </Button>
            </div>
         </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={editUserModalOpen}
        onClose={() => setEditUserModalOpen(false)}
        title="Edit Employee"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
          />
          <Input
            label="New Password (optional)"
            type="password"
            value={userForm.password}
            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
            placeholder="Leave empty to keep current password"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEditUserModalOpen(false)}>Cancel</Button>
            <Button
              onClick={() => updateUserMutation.mutate(userForm)}
              disabled={updateUserMutation.isPending}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={deleteUserModalOpen}
        onClose={() => setDeleteUserModalOpen(false)}
        title="Remove Employee"
      >
        <div className="p-4">
           <p className="mb-4">Are you sure you want to remove <strong>{selectedUser?.name}</strong>?</p>
           <p className="text-sm text-gray-500 mb-6">They will no longer be able to log in to this business.</p>
           <div className="flex justify-end gap-2">
             <Button variant="outline" onClick={() => setDeleteUserModalOpen(false)}>Cancel</Button>
             <Button 
                variant="danger" 
                onClick={() => deleteUserMutation.mutate(selectedUser._id)}
                disabled={deleteUserMutation.isPending}
             >
                Remove
             </Button>
           </div>
        </div>
      </Modal>

    </div>
  );
};

export default BusinessDetail;
