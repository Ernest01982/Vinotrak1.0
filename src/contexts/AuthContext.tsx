import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile, AuthUser } from '../lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  viewAs: 'admin' | 'rep';
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  toggleViewAs: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewAs, setViewAs] = useState<'admin' | 'rep'>('rep');

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('Found existing session for:', session.user.email);
          await fetchUserProfile(session.user, session);
        } else {
          console.log('No existing session found');
          if (mounted) {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (!mounted) return;

      try {
        if (session?.user) {
          await fetchUserProfile(session.user, session);
        } else {
          setUser(null);
          setSession(null);
          setViewAs('rep');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Update viewAs when user changes
  useEffect(() => {
    if (user?.profile) {
      setViewAs(user.profile.role);
    }
  }, [user]);

  const fetchUserProfile = async (authUser: User, authSession: Session) => {
    try {
      console.log('Fetching profile for user:', authUser.email);
      
      // First, try to get the profile
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // If profile doesn't exist, create it
      if (error && error.code === 'PGRST116') {
        console.log('Profile not found, creating new profile for user:', authUser.email);
        
        const newProfile = {
          id: authUser.id,
          display_name: authUser.user_metadata?.display_name || authUser.email || 'User',
          role: (authUser.email === 'admin@vinotrack.app' ? 'admin' : 'rep') as 'admin' | 'rep'
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          setLoading(false);
          return;
        }

        profile = createdProfile;
        console.log('Created new profile:', profile);
      } else if (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }

      if (profile) {
        const userData: AuthUser = {
          id: authUser.id,
          email: authUser.email!,
          profile
        };
        
        console.log('Setting user data:', userData);
        setUser(userData);
        setSession(authSession);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    } finally {
      // Don't set loading to false here, let the auth state change handle it
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role: email === 'admin@vinotrack.app' ? 'admin' : 'rep'
          }
        }
      });

      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Don't set loading to false here, let the auth state change handle it
    }
  };

  const toggleViewAs = () => {
    if (user?.profile.role === 'admin') {
      setViewAs(prev => prev === 'admin' ? 'rep' : 'admin');
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    viewAs,
    signIn,
    signUp,
    signOut,
    toggleViewAs
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};