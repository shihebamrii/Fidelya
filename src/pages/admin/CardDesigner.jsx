import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../services/api'; // Use adminApi instead of businessApi
import { Card, Button, Spinner, Input } from '../../components/ui';
import { toast } from 'react-hot-toast';
import '../client/ClientDashboard.css'; // Reuse card styles

const CardDesigner = () => {
  const { businessId } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [design, setDesign] = useState({
    primaryColor: '#0f172a',
    secondaryColor: '#334155',
    pattern: 'geometric',
    textColor: '#ffffff'
  });

  // Fetch business details
  const { data: businessData, isLoading } = useQuery({
    queryKey: ['admin-business', businessId],
    queryFn: () => adminApi.getBusiness(businessId),
    onSuccess: (data) => {
      if (data?.data?.business?.cardDesign) {
        setDesign(prev => ({ ...prev, ...data.data.business.cardDesign }));
      }
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (newDesign) => adminApi.updateBusiness(businessId, { cardDesign: newDesign }),
    onSuccess: () => {
      toast.success('Card design saved successfully!');
      queryClient.invalidateQueries(['admin-business', businessId]);
    },
    onError: () => {
      toast.error('Failed to save design.');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDesign(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateMutation.mutate(design);
  };

  // Preview Styles Helper
  const getPreviewStyles = () => {
    const patternOpacity = design.pattern === 'noise' ? '0.15' : '0.1';
    let patternBg = {};
    if (design.pattern === 'geometric') {
        patternBg = { backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' };
    } else if (design.pattern === 'noise') {
        patternBg = { backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` };
    }

    return {
        background: `linear-gradient(135deg, ${design.primaryColor} 0%, ${design.secondaryColor} 100%)`,
        color: design.textColor,
        '--card-text': design.textColor
    };
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Spinner size="lg" /></div>;

  const business = businessData?.data?.business;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(`/admin/businesses/${businessId}`)} className="text-gray-500 hover:text-gray-700">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Card Designer: {business?.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Controls */}
        <Card className="p-6 space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Appearance</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  name="primaryColor" 
                  value={design.primaryColor} 
                  onChange={handleChange}
                  className="h-10 w-10 rounded cursor-pointer border-0"
                />
                <Input 
                  name="primaryColor" 
                  value={design.primaryColor} 
                  onChange={handleChange}
                  className="uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  name="secondaryColor" 
                  value={design.secondaryColor} 
                  onChange={handleChange}
                  className="h-10 w-10 rounded cursor-pointer border-0"
                />
                <Input 
                  name="secondaryColor" 
                  value={design.secondaryColor} 
                  onChange={handleChange}
                  className="uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  name="textColor" 
                  value={design.textColor} 
                  onChange={handleChange}
                  className="h-10 w-10 rounded cursor-pointer border-0"
                />
                <select 
                   name="textColor" 
                   value={design.textColor} 
                   onChange={handleChange}
                   className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="#ffffff">White</option>
                    <option value="#000000">Black</option>
                    <option value="#fbbf24">Gold</option>
                </select>
              </div>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Texture Pattern</label>
             <div className="flex gap-4">
                {['clean', 'geometric', 'noise'].map(p => (
                    <button
                        key={p}
                        onClick={() => setDesign(prev => ({...prev, pattern: p}))}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium capitalize transition-colors
                            ${design.pattern === p 
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                                : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        {p}
                    </button>
                ))}
             </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
                onClick={handleSave} 
                isLoading={updateMutation.isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
            >
                Save Changes
            </Button>
          </div>
        </Card>

        {/* Live Preview */}
        <div className="flex flex-col items-center">
             <h2 className="text-lg font-semibold mb-6 text-gray-500">Live Preview</h2>
             
             {/* Reuse CSS classes from ClientDashboard but override styles inline */}
             <div className="w-full max-w-sm">
                <div 
                    className="loyalty-card" 
                    style={getPreviewStyles()}
                >
                    <div 
                        className="card-pattern-overlay" 
                        style={design.pattern === 'clean' ? {} : (
                            design.pattern === 'geometric' 
                            ? { backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px', opacity: 0.1 }
                            : { backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`, opacity: 0.15 }
                        )}
                    ></div>
                    <div className="card-shine"></div>
                    
                    <div className="card-inner">
                        <div className="card-top">
                            <div className="chip-icon">
                                <div className="chip-line"></div>
                            </div>
                        </div>

                        <div className="card-main">
                            <div className="points-display">
                                <span className="points-label" style={{color: design.textColor, opacity: 0.8}}>Total Points</span>
                                <span className="points-number" style={{color: design.textColor}}>1,250</span>
                            </div>
                        </div>

                        <div className="card-bottom">
                            <div className="client-info-block">
                                <span className="info-name" style={{color: design.textColor}}>John Doe</span>
                                <span className="info-id" style={{color: design.textColor, opacity: 0.7}}>MEMBER-001</span>
                            </div>
                            <div className="mini-qr-btn">
                                <div className="w-full h-full bg-black/10 flex items-center justify-center text-[8px]">QR</div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             <p className="mt-8 text-sm text-gray-500 text-center max-w-xs">
                This is how the card will appear on your clients' devices. 
                Use the controls to match your brand identity.
             </p>
        </div>
      </div>
    </div>
  );
};

export default CardDesigner;
