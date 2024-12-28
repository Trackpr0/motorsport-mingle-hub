import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const EnthusiastLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        // Check if user has a profile
        const { data: profile } = await supabase
          .from('enthusiast_profiles')
          .select('*')
          .eq('id', session?.user.id)
          .single();

        if (!profile) {
          navigate("/create-profile");
        } else {
          navigate("/home");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="text-white mb-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>
        
        <div className="backdrop-blur-lg bg-black/20 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">Enthusiast Login</h2>
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
              },
            }}
            providers={["google", "facebook", "twitter"]}
          />
        </div>
      </div>
    </div>
  );
};

export default EnthusiastLogin;