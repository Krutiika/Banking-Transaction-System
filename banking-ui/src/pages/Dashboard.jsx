import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BalanceCard from '../components/BalanceCard';
import TransactionCard from '../components/TransactionCard';
import { fetchAccountsApi } from '../services/accountService';
import { fetchTransactionsApi } from '../services/transactionService';
import { BANKING_DATA_REFRESH_EVENT } from '../services/refreshEvents';

const quickActions = [
  { label: 'Deposit', to: '/deposit', tone: 'primary' },
  { label: 'Withdraw', to: '/withdraw', tone: 'neutral' },
  { label: 'Transfer', to: '/transfer', tone: 'primary' },
  { label: 'Transactions', to: '/transactions', tone: 'neutral' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const welcomeName = user?.fullName || 'Rahul';

  const loadDashboard = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError('');
      const [accountsData, transactionsData] = await Promise.all([
        fetchAccountsApi(),
        fetchTransactionsApi(),
      ]);

      if (signal?.aborted) return;

      setAccounts(Array.isArray(accountsData) ? accountsData : []);
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
    } catch (err) {
      if (!signal?.aborted) {
        setError(err.message || 'Failed to load dashboard data.');
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadDashboard(controller.signal);

    function handleRefresh() {
      loadDashboard(controller.signal);
    }

    window.addEventListener(BANKING_DATA_REFRESH_EVENT, handleRefresh);

    return () => {
      controller.abort();
      window.removeEventListener(BANKING_DATA_REFRESH_EVENT, handleRefresh);
    };
  }, [loadDashboard]);

  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);
  }, [accounts]);

  function formatRs(value) {
    return `Rs${Number(value || 0).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    })}`;
  }

  function mapTransaction(transaction) {
    const amountNumber = Number(transaction.amount || 0);
    const isCredit = transaction.type === 'DEPOSIT';
    const isPending = transaction.status === 'PENDING';

    return {
      type: transaction.type?.replace(/_/g, ' ') || 'Transaction',
      amount: `${isCredit ? '+' : '-'}${formatRs(amountNumber).replace('Rs', '')}`,
      tone: isCredit ? 'positive' : 'negative',
      note: transaction.remarks || (isPending ? 'Pending transfer' : 'Recent activity'),
    };
  }

  const latestTransactions = transactions.slice(0, 3).map(mapTransaction);

  return (
    <div className="app-frame app-frame--dashboard">
      <Sidebar />
      <div className="app-frame__stack">
        <Navbar />
        <main className="dashboard-shell">
          <header className="dashboard-hero">
            <div>
              <p className="dashboard-kicker">Dashboard</p>
              <h1 className="dashboard-title">Welcome {welcomeName}</h1>
            </div>

            <button type="button" className="dashboard-signout" onClick={logout}>
              Sign Out
            </button>
          </header>

          <BalanceCard amount={loading ? 'Loading...' : formatRs(totalBalance)} />

          {error && (
            <section className="dashboard-panel">
              <p role="alert">{error}</p>
            </section>
          )}

          <section className="dashboard-grid">
            <article className="dashboard-panel">
              <div className="dashboard-panel__header">
                <h2>Accounts</h2>
              </div>
              <div className="dashboard-account-list">
                {accounts.map((account) => (
                  <div key={account.accountNumber} className="dashboard-account">
                    <div>
                      <p className="dashboard-account__name">{account.accountType}</p>
                      <p className="dashboard-account__note">{account.accountNumber}</p>
                    </div>
                    <p className="dashboard-account__balance">{formatRs(account.balance)}</p>
                  </div>
                ))}
                {!loading && accounts.length === 0 && (
                  <p className="dashboard-account__note">No accounts found.</p>
                )}
              </div>
            </article>

            <article className="dashboard-panel">
              <div className="dashboard-panel__header">
                <h2>Quick Actions</h2>
              </div>
              <div className="dashboard-actions">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className={`dashboard-action dashboard-action--${action.tone}`}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </article>
          </section>

          <section className="dashboard-panel dashboard-transactions">
            <div className="dashboard-panel__header">
              <h2>Latest Transactions</h2>
            </div>
            <div className="dashboard-transaction-list">
              {latestTransactions.map((transaction) => (
                <TransactionCard key={`${transaction.type}-${transaction.amount}`} {...transaction} />
              ))}
              {!loading && latestTransactions.length === 0 && (
                <p className="dashboard-account__note">No transactions yet.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
