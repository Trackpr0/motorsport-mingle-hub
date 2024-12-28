import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { ProfilePictureUpload } from "@/components/profile/ProfilePictureUpload";
import { ProfileFormFields } from "@/components/profile/ProfileForm";
import { ProfileFormValues } from "@/components/profile/types";

const CreateProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      birthdate: "",
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

  const onSubmit = async (data: ProfileFormValues) => {
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
        
        const { error: uploadError } = await supabase.storage
          .from('profile_pictures')
          .upload(fileName, data.avatar);

        if (uploadError) {
          toast.error("Error uploading profile picture");
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('profile_pictures')
          .getPublicUrl(fileName);

        avatarPath = publicUrl;
      }

      const { error: profileError } = await supabase
        .from('enthusiast_profiles')
        .upsert({
          id: session.user.id,
          username: data.username,
          first_name: data.firstName,
          last_name: data.lastName,
          birthdate: data.birthdate,
          avatar_url: avatarPath,
        });

      if (profileError) {
        toast.error("Error creating profile");
        return;
      }

      toast.success("Profile created successfully!");
      navigate("/home");
    } catch (error) {
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
            <ProfilePictureUpload
              avatarUrl={avatarUrl}
              onFileChange={handleAvatarChange}
            />
            
            <ProfileFormFields form={form} />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
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

export default CreateProfile;