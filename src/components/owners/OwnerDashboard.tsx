
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase, transformPropertyData } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Settings, Home, MessageSquare, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Property } from "@/data/properties";

export function OwnerDashboard() {
  const { session, isLoaded } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  useEffect(() => {
    const fetchOwnerData = async () => {
      if (!isLoaded || !session) return;

      try {
        setLoading(true);
        
        // Fetch properties owned by the current user
        const { data: propertyData, error: propertyError } = await supabase
          .from("properties")
          .select("*")
          .eq("owner_id", session.user.id);

        if (propertyError) throw propertyError;
        
        // Transform property data to match Property type
        const transformedProperties = propertyData.map(property => 
          transformPropertyData(property)
        );
        
        setProperties(transformedProperties);
        
        // In a real app, we would fetch inquiries and notifications here
        // For now, let's simulate some sample data
        setInquiries([
          { id: 1, propertyId: propertyData[0]?.id, from: "John Doe", email: "john@example.com", message: "I'm interested in this property", date: new Date().toISOString() },
          { id: 2, propertyId: propertyData[0]?.id, from: "Jane Smith", email: "jane@example.com", message: "Is this property still available?", date: new Date().toISOString() },
        ]);
        
        setNotifications([
          { id: 1, type: "inquiry", message: "New inquiry from John Doe", read: false, date: new Date().toISOString() },
          { id: 2, type: "system", message: "Your listing has been approved", read: true, date: new Date().toISOString() },
        ]);
        
      } catch (error: any) {
        console.error("Error fetching owner data:", error);
        uiToast({
          title: "Error loading data",
          description: error.message || "Could not load your properties and inquiries.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, [session, isLoaded, uiToast]);

  const handleCreateProperty = () => {
    // Navigate to property creation page
    navigate("/property-create");
  };

  const handleEditProperty = (propertyId: number) => {
    // Navigate to property edit page
    navigate(`/property/edit/${propertyId}`);
  };

  const handleDeleteProperty = async (propertyId: number) => {
    try {
      // Delete property
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", propertyId);

      if (error) throw error;

      // Update local state
      setProperties(properties.filter(property => property.id !== propertyId));
      
      toast.success("Property deleted successfully");
    } catch (error: any) {
      console.error("Error deleting property:", error);
      toast.error(error.message || "Could not delete your property.");
    }
  };

  const markNotificationAsRead = (notificationId: number) => {
    // Update notification read status
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    ));
  };

  const replyToInquiry = (inquiryId: number) => {
    // In a real app, this would open a message composer or similar
    toast.info("Reply to inquiry feature coming soon!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        <Button onClick={handleCreateProperty} className="flex items-center gap-2">
          <Plus size={16} />
          Add New Property
        </Button>
      </div>

      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Home size={16} />
            Properties
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="flex items-center gap-2">
            <MessageSquare size={16} />
            Inquiries
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="properties" className="space-y-4 mt-4">
          {properties.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">You haven't created any properties yet.</p>
                <Button onClick={handleCreateProperty} variant="outline" className="mt-4">
                  <Plus size={16} className="mr-2" />
                  Create your first property
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map(property => (
                <Card key={property.id}>
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={property.image || "/placeholder.svg"} 
                      alt={property.title}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                    <CardDescription>{property.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="font-medium text-xl">{property.price}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {property.beds} beds · {property.baths} baths
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {property.type}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditProperty(property.id)}
                      >
                        <Settings size={16} className="mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteProperty(property.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="inquiries" className="space-y-4 mt-4">
          {inquiries.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No inquiries yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {inquiries.map(inquiry => (
                <Card key={inquiry.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Inquiry from {inquiry.from}
                    </CardTitle>
                    <CardDescription>
                      {new Date(inquiry.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{inquiry.message}</p>
                    <p className="text-sm text-muted-foreground">
                      Contact: {inquiry.email}
                    </p>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => replyToInquiry(inquiry.id)}
                      >
                        Reply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No notifications.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map(notification => (
                <Card 
                  key={notification.id}
                  className={notification.read ? "" : "border-blue-400 shadow-blue-100"}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{notification.message}</span>
                      {!notification.read && (
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {new Date(notification.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!notification.read && (
                      <div className="flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
