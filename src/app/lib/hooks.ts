import { NhostClient } from "@nhost/nhost-js";

const nhostClient = new NhostClient({
  authUrl: import.meta.env.VITE_NHOST_AUTH_URL,
  graphqlUrl: import.meta.env.VITE_NHOST_GQL_URL,
  storageUrl: import.meta.env.VITE_NHOST_STORAGE_URL,
  functionsUrl: import.meta.env.VITE_NHOST_FUNCTIONS_URL,
});

export const useNhost = () => {
  return nhostClient;
};
