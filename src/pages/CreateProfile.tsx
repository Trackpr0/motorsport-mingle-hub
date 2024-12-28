import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface ProfileFormValues {
  fullName: string;
  avatar?: File;
}

const CreateProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: "",
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

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("No authenticated session found");
        return;
      }

      let finalAvatarUrl = null;
      
      // Handle avatar upload if provided
      if (data.avatar) {
        const fileExt = data.avatar.name.split('.').pop();
        const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('profile_pictures')
          .upload(fileName, data.avatar);

        if (uploadError) {
          toast.error("Error uploading profile picture");
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('profile_pictures')
          .getPublicUrl(fileName);

        finalAvatarUrl = publicUrl;
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('enthusiast_profiles')
        .insert({
          id: session.user.id,
          full_name: data.fullName,
          avatar_url: finalAvatarUrl,
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

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("avatar", file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white rounded-lg p-6 shadow-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="text-gray-600">Let's get to know you better</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarUrl || ""} />
                <AvatarFallback>
                  <Upload className="w-8 h-8 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("avatar-upload")?.click()}
                >
                  Upload Profile Picture
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating Profile..." : "Complete Profile"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateProfile;