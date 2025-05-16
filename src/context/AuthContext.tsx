import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { GitHubClient } from '../lib/github';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  githubToken: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  githubClient: GitHubClient | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  githubClient: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [githubClient, setGithubClient] = useState<GitHubClient | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { user: authUser } = session;
        if (authUser) {
          const githubToken = session.provider_token;
          if (githubToken) {
            setGithubClient(new GitHubClient(githubToken));
            setUser({
              id: authUser.id,
              name: authUser.user_metadata?.full_name || authUser.email || 'User',
              avatarUrl: authUser.user_metadata?.avatar_url || '',
              githubToken
            });
          }
        }
      } else {
        setUser(null);
        setGithubClient(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        scopes: 'repo',
      },
    });

    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setGithubClient(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        githubClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};