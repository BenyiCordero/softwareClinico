const apiUrl = import.meta.env.VITE_API_URL?.trim()

/** Runtime configuration shared by infrastructure services. */
export const appEnv = {
  apiUrl: apiUrl || '/api/v1',
} as const
