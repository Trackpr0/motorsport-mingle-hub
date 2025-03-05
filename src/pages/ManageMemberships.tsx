
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, ChevronLeft, Loader2, Users } from "lucide-react";
import FooterNav from "@/components/navigation/FooterNav";

interface Membership {
  id: string;
  name: string;
  description: string | null;
  price: number;
  created_at: string;
  subscriber_count?: number;
}

const ManageMemberships = () => {
  const navigate = useNavigate();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMembership, setNewMembership] = useState({
    name: "",
    description: "",
    price: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      // Fetch memberships with subscriber count
      const { data, error } = await supabase
        .from('memberships')
        .select(`
          *,
          subscriber_count:user_memberships(count)
        `)
        .eq('business_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemberships(data || []);
    } catch (error) {
      console.error("Error fetching memberships:", error);
      toast.error("Failed to load memberships");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingId) {
      setMemberships(prev => 
        prev.map(membership => 
          membership.id === editingId 
            ? { ...membership, [name]: value } 
            : membership
        )
      );
    } else {
      setNewMembership(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddMembership = async () => {
    if (!newMembership.name || !newMembership.price) {
      toast.error("Please enter name and price");
      return;
    }

    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('memberships')
        .insert({
          business_id: session.user.id,
          name: newMembership.name,
          description: newMembership.description || null,
          price: parseFloat(newMembership.price)
        })
        .select();

      if (error) throw error;
      
      toast.success("Membership added successfully");
      setNewMembership({ name: "", description: "", price: "" });
      setShowAddForm(false);
      fetchMemberships();
    } catch (error) {
      console.error("Error adding membership:", error);
      toast.error("Failed to add membership");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateMembership = async (id: string) => {
    setSubmitting(true);
    try {
      const membership = memberships.find(m => m.id === id);
      if (!membership) return;

      const { error } = await supabase
        .from('memberships')
        .update({
          name: membership.name,
          description: membership.description,
          price: membership.price
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Membership updated successfully");
      setEditingId(null);
      fetchMemberships();
    } catch (error) {
      console.error("Error updating membership:", error);
      toast.error("Failed to update membership");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMembership = async (id: string) => {
    if (!confirm("Are you sure you want to delete this membership? All members will lose access.")) {
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('memberships')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Membership deleted successfully");
      setMemberships(prev => prev.filter(membership => membership.id !== id));
    } catch (error) {
      console.error("Error deleting membership:", error);
      toast.error("Failed to delete membership");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewMembers = (membershipId: string, membershipName: string) => {
    navigate(`/membership/${membershipId}/members`, { 
      state: { membershipName } 
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] pb-20">
      <div className="bg-white p-4 shadow-sm mb-4 flex items-center">
        <Button variant="ghost" onClick={() => navigate('/profile')} className="p-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Manage Memberships</h1>
      </div>

      <div className="max-w-md mx-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {!showAddForm && (
              <Button 
                onClick={() => setShowAddForm(true)} 
                className="w-full mb-4 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Create New Membership
              </Button>
            )}

            {showAddForm && (
              <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <h2 className="text-lg font-medium mb-3">New Membership</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <Input
                      name="name"
                      value={newMembership.name}
                      onChange={handleInputChange}
                      placeholder="Premium Membership"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                    <Input
                      name="description"
                      value={newMembership.description}
                      onChange={handleInputChange}
                      placeholder="Access to exclusive events and content"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <Input
                      name="price"
                      type="number"
                      value={newMembership.price}
                      onChange={handleInputChange}
                      placeholder="99.99"
                      className="w-full"
                    />
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1"
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddMembership}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={submitting}
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {memberships.length === 0 && !showAddForm ? (
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                <p className="text-gray-500 mb-4">You haven't created any memberships yet</p>
                <Button 
                  onClick={() => setShowAddForm(true)} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Your First Membership
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {memberships.map(membership => (
                  <div key={membership.id} className="bg-white rounded-lg p-4 shadow-sm">
                    {editingId === membership.id ? (
                      <div className="space-y-3">
                        <Input
                          name="name"
                          value={membership.name}
                          onChange={handleInputChange}
                          className="font-medium"
                        />
                        <Input
                          name="description"
                          value={membership.description || ''}
                          onChange={handleInputChange}
                          placeholder="No description"
                        />
                        <Input
                          name="price"
                          type="number"
                          value={membership.price}
                          onChange={handleInputChange}
                        />
                        <div className="flex justify-end space-x-2 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => setEditingId(null)}
                            disabled={submitting}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleUpdateMembership(membership.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={submitting}
                          >
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-medium">{membership.name}</h3>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingId(membership.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMembership(membership.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {membership.description || "No description"}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="font-semibold">${parseFloat(membership.price.toString()).toFixed(2)}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewMembers(membership.id, membership.name)}
                            className="text-sm py-1"
                          >
                            <Users className="h-4 w-4 mr-1" />
                            {membership.subscriber_count} Member{membership.subscriber_count !== 1 ? 's' : ''}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <FooterNav />
    </div>
  );
};

export default ManageMemberships;
