import { apiClient } from './apiClient';

export async function fetchTransactionsApi() {
  const { data } = await apiClient.get('/transactions');
  return data;
}
