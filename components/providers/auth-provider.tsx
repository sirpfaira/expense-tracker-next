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
import { LoginValues, RegisterValues, UserResponse } from "@/lib/models/user";

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetchUser: UseMutateFunction<UserResponse | null, Error, void, unknown>;
  login: (data: LoginValues) => Promise<void>;
  registerUser: (data: RegisterValues) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchCurrentUser(): Promise<UserResponse | null> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) return null;
  const data = await res.json();
  return data.user;
}

async function loginRequest(data: LoginValues): Promise<UserResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Login failed");
  }

  const payload = await res.json();
  return payload.user;
}

async function registerRequest(data: RegisterValues): Promise<UserResponse> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Registration failed");
  }

  const payload = await res.json();
  return payload.user;
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
    mutationFn: (data: LoginValues) => loginRequest(data),
    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "user"], user);
      router.push("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterValues) => registerRequest(data),
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
    async (data: LoginValues) => {
      await loginMutation.mutateAsync(data);
    },
    [loginMutation],
  );

  const registerUser = useCallback(
    async (data: RegisterValues) => {
      await registerMutation.mutateAsync(data);
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
      registerUser,
      logout,
    }),
    [user, isLoading, login, registerUser, logout],
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
