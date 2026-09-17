import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TransactionTable from '../components/TransactionTable';
import { fetchTransactionsApi } from '../services/transactionService';
import { BANKING_DATA_REFRESH_EVENT } from '../services/refreshEvents';

export default function Transactions() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTransactions = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError('');

      const data = await fetchTransactionsApi();
      if (signal?.aborted) return;

      const mappedRows = (Array.isArray(data) ? data : []).map((transaction) => {
        const amountValue = Number(transaction.amount || 0);
        const isCredit = transaction.type === 'DEPOSIT';

        return {
          key: transaction.reference,
          date: transaction.createdAt
            ? new Date(transaction.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'N/A',
          type: transaction.type?.replace(/_/g, ' ') || 'Transaction',
          amount: `${isCredit ? '+' : '-'}Rs${amountValue.toLocaleString('en-IN')}`,
          status: transaction.status === 'SUCCESS' ? 'Success' : transaction.status || 'Pending',
          tone: isCredit ? 'positive' : 'negative',
        };
      });

      setRows(mappedRows);
    } catch (err) {
      if (!signal?.aborted) {
        setError(err.message || 'Failed to load transaction history.');
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadTransactions(controller.signal);

    function handleRefresh() {
      loadTransactions(controller.signal);
    }

    window.addEventListener(BANKING_DATA_REFRESH_EVENT, handleRefresh);

    return () => {
      controller.abort();
      window.removeEventListener(BANKING_DATA_REFRESH_EVENT, handleRefresh);
    };
  }, [loadTransactions]);

  const emptyMessage = useMemo(() => {
    if (loading) return 'Loading transactions...';
    if (error) return error;
    return 'No transactions yet.';
  }, [loading, error]);

  return (
    <div className="app-frame">
      <Sidebar />
      <div className="app-frame__stack">
        <Navbar />
        <main className="transactions-shell transactions-shell--stacked">
          <section className="transactions-card">
            <div className="transactions-header">
              <p className="transactions-kicker">History</p>
              <h1>Transaction History</h1>
            </div>

            {error ? (
              <p role="alert">{emptyMessage}</p>
            ) : rows.length > 0 ? (
              <TransactionTable rows={rows} />
            ) : (
              <p>{emptyMessage}</p>
            )}

            <div className="transactions-footer">
              <Link to="/dashboard" className="transactions-backlink">
                Back to Dashboard
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
