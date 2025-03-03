
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { BusinessProfilePictureUpload } from "@/components/profile/BusinessProfilePictureUpload";
import { BusinessProfileFormFields } from "@/components/profile/BusinessProfileForm";

interface BusinessProfileFormValues {
  businessName: string;
  avatar?: File;
}

const CreateBusinessProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const form = useForm<BusinessProfileFormValues>({
    defaultValues: {
      businessName: "",
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("avatar", file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: BusinessProfileFormValues) => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("No authenticated session found");
        return;
      }

      let avatarPath = null;
      
      if (data.avatar) {
        const fileExt = data.avatar.name.split('.').pop();
        const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('profile_pictures')
          .upload(fileName, data.avatar);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast.error("Error uploading profile picture");
          return;
        }

        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('profile_pictures')
            .getPublicUrl(uploadData.path);
          avatarPath = publicUrl;
        }
      }

      const { error: profileError } = await supabase
        .from('enthusiast_profiles')
        .upsert({
          id: session.user.id,
          username: data.businessName, // Use business name as username
          first_name: data.businessName, // Store business name in first_name field for now
          user_type: 'business', // Set user type to business
          avatar_url: avatarPath,
        });

      if (profileError) {
        console.error('Profile error:', profileError);
        toast.error("Error creating business profile");
        return;
      }

      toast.success("Business profile created successfully!");
      navigate("/home");
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-2xl font-bold text-center">Create Profile</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BusinessProfilePictureUpload
              avatarUrl={avatarUrl}
              onFileChange={handleAvatarChange}
            />
            
            <BusinessProfileFormFields form={form} />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              Continue
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateBusinessProfile;
