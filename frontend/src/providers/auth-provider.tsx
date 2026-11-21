"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { User } from "@/types";
import { api } from "@/lib/api/endpoints";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = Cookies.get("token");
    const savedUser = Cookies.get("user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        Cookies.remove("token");
        Cookies.remove("user");
      }
    } else if (savedToken) {
      setToken(savedToken);
      api.auth
        .me()
        .then((res) => {
          if (res.data) {
            setUser(res.data);
            Cookies.set("user", JSON.stringify(res.data), { sameSite: "lax", expires: 7 });
          }
        })
        .catch(() => {
          logout();
        });
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    Cookies.set("token", newToken, { sameSite: "lax", expires: 7 });
    Cookies.set("user", JSON.stringify(newUser), { sameSite: "lax", expires: 7 });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove("token");
    Cookies.remove("user");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
