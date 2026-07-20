interface EnvConfig {
  appName: string;
  appEnvironment: string;
  apiBaseUrl: string;
  requestTimeout: number;
  appVersion: string;
}

export const env: EnvConfig = {
  appName: import.meta.env.VITE_APP_NAME ?? 'Project Structure',
  appEnvironment: import.meta.env.VITE_APP_ENV ?? 'development',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'https://dummyjson.com',
  requestTimeout: Number(import.meta.env.VITE_REQUEST_TIMEOUT ?? 30000),
  appVersion: import.meta.env.VITE_APP_VERSION ?? '1.0.0',
};
