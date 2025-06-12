import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  const formatUser = async (fbUser: FirebaseUser): Promise<User> => {
    const userRef = doc(db, 'profiles', fbUser.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      const defaultUser: User = {
        id: fbUser.uid,
        email: fbUser.email || '',
        name: fbUser.displayName || 'User',
        role: 'storekeeper', // default role
      };
      await setDoc(userRef, defaultUser);
      return defaultUser;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const formatted = await formatUser(firebaseUser);
        setUser(formatted);
        setSession(firebaseUser);
      } else {
        setUser(null);
        setSession(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;
    const formatted = await formatUser(fbUser);
    setUser(formatted);
    return { error: null };
  } catch (error: any) {
    console.error('🔥 Firebase login error:', error.code, error.message);
    return { error };
  }
};


  const signup = async (email: string, password: string, name: string) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });

      const newUser: User = {
        id: userCred.user.uid,
        email,
        name,
        role: 'storekeeper',
      };

      await setDoc(doc(db, 'profiles', newUser.id), newUser);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      await formatUser(fbUser);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateUserRole = async (role: 'manager' | 'storekeeper') => {
    if (!user) return { error: new Error('No user logged in') };
    try {
      const updatedUser = { ...user, role };
      await setDoc(doc(db, 'profiles', user.id), updatedUser);
      setUser(updatedUser);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setSession(null);
  };

  const value: AuthContextType = {
    user,
    session,
    login,
    loginWithGoogle,
    signup,
    updateUserRole,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
