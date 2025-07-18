// contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Define public routes
  const publicRoutes = ["/", "/login", "/register", "/auth/callback", "/privacy", "/terms", "/support"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
        }

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setInitialized(true);

        console.log("Initial session check:", {
          hasSession: !!session,
          pathname,
          userEmail: session?.user?.email,
        });
      } catch (error) {
        console.error("Session initialization error:", error);
        setLoading(false);
        setInitialized(true);
      }
    };

    getInitialSession();
  }, []);

  // Handle routing after initialization
  useEffect(() => {
    if (!initialized || loading) return;

    const handleRouting = () => {
      if (session && user) {
        // User is authenticated
        if (pathname === "/login" || pathname === "/register") {
          console.log(
            "Authenticated user on auth page, redirecting to dashboard"
          );
          router.push("/dashboard");
        }
        // Allow access to auth callback during OAuth flow
        else if (pathname === "/auth/callback") {
          console.log("Processing auth callback...");
          // Let the callback page handle the redirect
        }
      } else {
        // User is not authenticated
        if (!isPublicRoute) {
          console.log(
            "Unauthenticated user on protected route, redirecting to login"
          );
          router.push("/login");
        }
      }
    };

    // Small delay to prevent race conditions
    const timer = setTimeout(handleRouting, 100);
    return () => clearTimeout(timer);
  }, [session, user, pathname, initialized, loading, isPublicRoute, router]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Just handle routing - NO TOASTS
      if (event === "SIGNED_IN") {
        // Only redirect if user is on login/register pages or homepage
        const authPages = ["/login", "/register", "/", "/auth/callback"];
        if (authPages.includes(pathname)) {
          console.log("Redirecting to dashboard from auth page");
          router.push("/dashboard");
        } else {
          console.log("User signed in but staying on current page:", pathname);
        }
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out, redirecting to home");
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast.error("Sign out failed", {
          description: "Please try again",
          duration: 3000,
        });
      }
      // The onAuthStateChange will handle the success toast and redirect
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Sign out failed", {
        description: "An unexpected error occurred",
        duration: 3000,
      });
    } finally {
      toast.success("You have been signed out", {
        duration: 2000,
      });
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
