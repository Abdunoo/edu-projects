export const useAuth = () => {
  const store = useAuthStore();
  const can = (role: string) => store.user?.role?.name === role;
  return {
    ...storeToRefs(store),
    login: store.login,
    logout: store.logout,
    hydrate: store.hydrate,
    can,
  };
};
