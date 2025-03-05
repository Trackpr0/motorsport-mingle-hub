
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, Check, Lock } from "lucide-react";
import FooterNav from "@/components/navigation/FooterNav";

interface Membership {
  id: string;
  name: string;
  description: string | null;
  price: number;
  business_id: string;
  is_subscribed?: boolean;
  business_name?: string;
}

const BrowseMemberships = () => {
  const navigate = useNavigate();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Fetch all memberships
      let query = supabase
        .from('memberships')
        .select(`
          *,
          enthusiast_profiles!business_id(first_name)
        `)
        .order('price', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to include business name
      let transformedData = data.map((item: any) => ({
        ...item,
        business_name: item.enthusiast_profiles?.first_name || 'Business',
        is_subscribed: false
      }));
      
      // If user is logged in, check which memberships they're subscribed to
      if (session) {
        const { data: subscriptions, error: subscriptionsError } = await supabase
          .from('user_memberships')
          .select('membership_id')
          .eq('user_id', session.user.id);
          
        if (!subscriptionsError && subscriptions) {
          const subscribedIds = subscriptions.map(sub => sub.membership_id);
          transformedData = transformedData.map(membership => ({
            ...membership,
            is_subscribed: subscribedIds.includes(membership.id)
          }));
        }
      }
      
      setMemberships(transformedData);
    } catch (error) {
      console.error("Error fetching memberships:", error);
      toast.error("Failed to load memberships");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (membershipId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please log in to subscribe to memberships");
      navigate("/login");
      return;
    }
    
    setSubscribing(membershipId);
    try {
      // Check if already subscribed (double-check)
      const { data: existing, error: checkError } = await supabase
        .from('user_memberships')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('membership_id', membershipId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existing) {
        toast.info("You're already subscribed to this membership");
        setSubscribing(null);
        return;
      }
      
      // In a real app, we would integrate with a payment processor here
      // For now, we'll just create the subscription directly
      
      const { error } = await supabase
        .from('user_memberships')
        .insert({
          user_id: session.user.id,
          membership_id: membershipId,
          is_active: true
        });
        
      if (error) throw error;
      
      toast.success("Successfully subscribed!");
      
      // Update the UI
      setMemberships(prev => 
        prev.map(membership => 
          membership.id === membershipId 
            ? { ...membership, is_subscribed: true } 
            : membership
        )
      );
    } catch (error) {
      console.error("Error subscribing to membership:", error);
      toast.error("Failed to subscribe");
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-20">
      <div className="bg-white p-4 shadow-sm mb-4 flex items-center">
        <Button variant="ghost" onClick={() => navigate('/')} className="p-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Available Memberships</h1>
      </div>

      <div className="max-w-md mx-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : memberships.length === 0 ? (
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <p className="text-gray-500">No memberships available at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {memberships.map(membership => (
              <div key={membership.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium">{membership.name}</h3>
                    <p className="text-sm text-gray-500">By {membership.business_name}</p>
                  </div>
                  <div className="font-semibold text-lg">
                    ${parseFloat(membership.price.toString()).toFixed(2)}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {membership.description || "Access exclusive content and events"}
                </p>
                <Button
                  className="w-full"
                  disabled={subscribing === membership.id || membership.is_subscribed}
                  onClick={() => handleSubscribe(membership.id)}
                  variant={membership.is_subscribed ? "outline" : "default"}
                >
                  {subscribing === membership.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : membership.is_subscribed ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Lock className="h-4 w-4 mr-2" />
                  )}
                  {membership.is_subscribed ? "Subscribed" : "Subscribe"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <FooterNav />
    </div>
  );
};

export default BrowseMemberships;
