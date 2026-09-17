import { apiClient } from './apiClient';

export async function fetchAccountsApi() {
  const { data } = await apiClient.get('/accounts');
  return data;
}
