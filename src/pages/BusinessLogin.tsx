
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BusinessLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Setting up auth state change listener for business");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session ? "Has session" : "No session");
      
      if (event === "SIGNED_IN" && session) {
        setIsLoading(true);
        try {
          // Check if user exists and what type they are
          const { data: profile, error } = await supabase
            .from('enthusiast_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error("Error fetching profile:", error);
            toast({
              title: "Error",
              description: "Failed to fetch profile information",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }

          // If profile exists, check if it's a business profile
          if (profile) {
            if (profile.user_type !== 'business') {
              // If not a business profile, sign out and show error
              await supabase.auth.signOut();
              toast({
                title: "Access Denied",
                description: "This account is registered as an Enthusiast. Please use the Enthusiast login.",
                variant: "destructive",
              });
              setIsLoading(false);
              return;
            }
            
            // It's a valid business account, redirect to home
            navigate("/home");
          } else {
            // No profile yet, create one as business
            navigate("/create-profile", { 
              state: { userType: "business" } 
            });
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

    // Check for auth-related errors in URL
    const url = new URL(window.location.href);
    const errorDescription = url.searchParams.get('error_description');
    if (errorDescription) {
      setAuthError(errorDescription);
      toast({
        title: "Authentication Error",
        description: errorDescription,
        variant: "destructive",
      });
    }

    return () => {
      console.log("Cleaning up auth state change listener for business");
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
          <h2 className="text-2xl font-bold text-center mb-6 text-white">Business Login</h2>
          
          {authError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-white">
              {authError}
            </div>
          )}
          
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessLogin;
