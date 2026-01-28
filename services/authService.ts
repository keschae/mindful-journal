import { supabase } from './supabaseClient';
import { User } from '../types';

export const login = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.session?.user) {
    throw new Error('Login failed');
  }

  const user = data.session.user;
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || 'User',
  };
};

export const signup = async (email: string, password: string, name: string): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Signup failed');
  }

  // If session is null, it means email confirmation is required.
  if (data.user && !data.session) {
    throw new Error("Account created! Please check your email to confirm your account before logging in.");
  }
  
  return {
    id: data.user.id,
    email: data.user.email || '',
    name: name,
  };
};

export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Logout error:', error);
  }
};

export const getSession = async (): Promise<User | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) return null;

  return {
    id: session.user.id,
    email: session.user.email || '',
    name: session.user.user_metadata?.name || 'User',
  };
};