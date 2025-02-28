
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const EnthusiastLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Setting up auth state change listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session ? "Has session" : "No session");
      
      if (event === "SIGNED_IN" && session) {
        setIsLoading(true);
        try {
          // Check if user has a profile
          const { data: profile, error } = await supabase
            .from('enthusiast_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            toast({
              title: "Error",
              description: "Failed to fetch profile information",
              variant: "destructive",
            });
          }

          if (!profile) {
            navigate("/create-profile");
          } else {
            navigate("/home");
          }
        } catch (error) {
          console.error("Error in auth flow:", error);
          toast({
            title: "Authentication Error",
            description: "Something went wrong during sign in",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="text-white mb-4" 
          onClick={() => navigate(-1)}
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>
        
        <div className="backdrop-blur-lg bg-black/20 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">Enthusiast Login</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#2563EB',
                      brandAccent: '#1E40AF',
                    },
                  },
                },
                style: {
                  button: {
                    background: '#2563EB',
                    borderRadius: '0.5rem',
                  },
                  anchor: {
                    color: '#fff',
                  },
                  label: {
                    color: '#fff',
                  },
                  input: {
                    borderRadius: '0.375rem',
                  },
                  message: {
                    color: '#fff',
                  },
                },
              }}
              providers={["google", "facebook", "twitter"]}
              onError={(error) => {
                console.error("Auth error:", error);
                toast({
                  title: "Authentication Error",
                  description: error.message || "Failed to sign in",
                  variant: "destructive",
                });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EnthusiastLogin;
