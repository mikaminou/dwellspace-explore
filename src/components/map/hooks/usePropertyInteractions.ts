
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function usePropertyInteractions() {
  const navigate = useNavigate();
  
  // Handle property save
  const handleSaveProperty = (propertyId: number) => {
    console.log('Saving property:', propertyId);
    toast.success('Property saved to favorites');
  };

  // Handle message to owner
  const handleMessageOwner = (ownerId: number) => {
    console.log('Messaging owner:', ownerId);
    toast.success('Message panel opened');
  };

  return {
    navigate,
    handleSaveProperty,
    handleMessageOwner
  };
}
