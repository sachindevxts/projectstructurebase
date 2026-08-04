import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export const interceptorManager = {
  registerRequestInterceptor: (
    client: AxiosInstance,
    onFulfilled?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
    onRejected?: (error: AxiosError) => unknown
  ) => {
    return client.interceptors.request.use(onFulfilled, onRejected);
  },

  registerResponseInterceptor: (
    client: AxiosInstance,
    onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
    onRejected?: (error: AxiosError) => unknown
  ) => {
    return client.interceptors.response.use(onFulfilled, onRejected);
  },

  ejectRequestInterceptor: (client: AxiosInstance, id: number) => {
    client.interceptors.request.eject(id);
  },

  ejectResponseInterceptor: (client: AxiosInstance, id: number) => {
    client.interceptors.response.eject(id);
  },
};