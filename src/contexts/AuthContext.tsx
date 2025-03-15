// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

interface AuthContextProps {
  user: any;
  role: string;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  role: "",
  loading: true,
  signOut: () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user || null);
    setRole(session?.user?.role || "");
    setLoading(false);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
        setRole(session?.user?.role || "");
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole("");
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
