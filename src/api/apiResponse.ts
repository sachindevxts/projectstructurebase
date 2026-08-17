export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export function unwrapApiData<T>(response: ApiEnvelope<T> | T): T {
  if (response && typeof response === 'object' && 'data' in response && 'success' in response) {
    return (response as ApiEnvelope<T>).data;
  }

  return response as T;
}
