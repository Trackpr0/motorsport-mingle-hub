import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const EnthusiastLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/home");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 mt-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Enthusiast Login</h2>
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
          }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default EnthusiastLogin;