"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getSession } from "@/lib/auth";

type SessionUser = {
  id: string;
  username: string;
  email: string;
};

type AuthContextProps = {
  sessionUser: SessionUser | null;
  session: boolean;
  initialized?: boolean;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextProps>({
  sessionUser: null,
  session: false,
  initialized: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [sessionUser, setUser] = useState<SessionUser | null>(null);
  const [session, setSession] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  const getSessionData = useCallback(async () => {
    const session = await getSession();
    if (session) {
      setSession(true);
      setUser(session.userData);
      setInitialized(true);
    } else {
      setSession(false);
      setUser(null);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    getSessionData();
  }, [getSessionData]);

  return (
    <AuthContext.Provider
      value={{
        sessionUser,
        session,
        initialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
