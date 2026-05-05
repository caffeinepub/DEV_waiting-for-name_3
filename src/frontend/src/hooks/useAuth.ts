import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const {
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    identity,
    loginStatus,
  } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    clear();
    queryClient.clear();
  };

  const principalText = identity ? identity.getPrincipal().toString() : null;

  const principalShort = principalText
    ? `${principalText.slice(0, 5)}...${principalText.slice(-5)}`
    : null;

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    identity,
    principalText,
    principalShort,
    login: handleLogin,
    logout: handleLogout,
  };
}
