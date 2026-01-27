"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutateFunction,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { UserResponse } from "@/lib/models/user";

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetchUser: UseMutateFunction<UserResponse | null, Error, void, unknown>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchCurrentUser(): Promise<UserResponse | null> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) return null;
  const data = await res.json();
  return data.user;
}

async function loginRequest(
  email: string,
  password: string,
): Promise<UserResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Login failed");
  }

  const data = await res.json();
  return data.user;
}

async function registerRequest(
  name: string,
  email: string,
  password: string,
): Promise<UserResponse> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Registration failed");
  }

  const data = await res.json();
  return data.user;
}

async function logoutRequest(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: fetchCurrentUser,
    retry: false,
  });

  const { mutate: refetchUser } = useMutation({
    mutationFn: fetchCurrentUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "user"], user);
    },
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginRequest(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "user"], user);
      router.push("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => registerRequest(name, email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "user"], user);
      router.push("/dashboard");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      queryClient.setQueryData(["auth", "user"], null);
      queryClient.clear();
      router.push("/login");
    },
  });

  const login = useCallback(
    async (email: string, password: string) => {
      await loginMutation.mutateAsync({ email, password });
    },
    [loginMutation],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await registerMutation.mutateAsync({ name, email, password });
    },
    [registerMutation],
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const value = useMemo(
    () => ({
      user: user ?? null,
      isLoading,
      isAuthenticated: !!user,
      refetchUser,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
