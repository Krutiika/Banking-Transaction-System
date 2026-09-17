export const BANKING_DATA_REFRESH_EVENT = 'banking:data-refresh';

export function emitBankingDataRefresh() {
  window.dispatchEvent(new Event(BANKING_DATA_REFRESH_EVENT));
}
