
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          console.log('Profile fetch result:', { profile, error });
          
          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              role: profile.role,
              name: profile.name
            });
          } else if (error && error.code === 'PGRST116') {
            // Profile doesn't exist, create one
            console.log('Creating new profile for user');
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
                role: 'storekeeper' // Default role, will be updated after selection
              })
              .select()
              .single();
            
            if (newProfile && !createError) {
              setUser({
                id: newProfile.id,
                email: newProfile.email,
                role: newProfile.role,
                name: newProfile.name
              });
            } else {
              console.error('Error creating profile:', createError);
            }
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('Existing session found:', session);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Attempting login with:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Login error:', error);
    }
    return { error };
  };

  const loginWithGoogle = async () => {
    console.log('Attempting Google login');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      console.error('Google login error:', error);
    }
    return { error };
  };

  const signup = async (email: string, password: string, name: string) => {
    console.log('Attempting signup with:', email, name);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          full_name: name
        }
      }
    });
    
    if (error) {
      console.error('Signup error:', error);
    }
    return { error };
  };

  const updateUserRole = async (role: 'manager' | 'storekeeper') => {
    if (!user) return { error: new Error('No user logged in') };
    
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', user.id);
    
    if (!error) {
      setUser({ ...user, role });
    }
    
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextType = {
    user,
    session,
    login,
    loginWithGoogle,
    signup,
    updateUserRole,
    logout,
    isAuthenticated: !!session,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
