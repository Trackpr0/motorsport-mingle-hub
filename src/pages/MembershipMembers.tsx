
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Member {
  id: string;
  user_id: string;
  purchase_date: string;
  enthusiast_profiles: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

const MembershipMembers = () => {
  const navigate = useNavigate();
  const { membershipId } = useParams<{ membershipId: string }>();
  const location = useLocation();
  const membershipName = location.state?.membershipName || "Membership";
  
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!membershipId) {
      navigate("/manage-memberships");
      return;
    }
    
    fetchMembers();
  }, [membershipId]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      // First check if this membership belongs to the current business
      const { data: membership, error: membershipError } = await supabase
        .from('memberships')
        .select('*')
        .eq('id', membershipId)
        .eq('business_id', session.user.id)
        .single();

      if (membershipError || !membership) {
        toast.error("You don't have access to this membership");
        navigate("/manage-memberships");
        return;
      }

      // Fetch members
      const { data, error } = await supabase
        .from('user_memberships')
        .select(`
          *,
          enthusiast_profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('membership_id', membershipId)
        .order('purchase_date', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE]">
      <div className="bg-white p-4 shadow-sm mb-4 flex items-center">
        <Button variant="ghost" onClick={() => navigate('/manage-memberships')} className="p-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold ml-2">{membershipName} Members</h1>
      </div>

      <div className="max-w-md mx-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <p className="text-gray-500">No members have subscribed to this membership yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {members.map(member => (
              <div key={member.id} className="bg-white rounded-lg p-4 shadow-sm flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  {member.enthusiast_profiles.avatar_url ? (
                    <AvatarImage src={member.enthusiast_profiles.avatar_url} alt="User avatar" />
                  ) : (
                    <AvatarFallback>
                      <User className="h-6 w-6 text-gray-400" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">
                    {member.enthusiast_profiles.full_name || member.enthusiast_profiles.username || "User"}
                  </h3>
                  <p className="text-sm text-gray-500">Member since {formatDate(member.purchase_date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipMembers;
