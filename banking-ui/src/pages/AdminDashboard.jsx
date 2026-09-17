import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MetricCard from '../components/MetricCard';

const metrics = [
  { label: 'Total Customers', value: '2500' },
  { label: 'Total Accounts', value: '4300' },
  { label: "Today's Transactions", value: '1350' },
  { label: 'Pending Transfers', value: '5' },
];

const customers = [
  { name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', status: 'Active' },
  { name: 'Anita Mehta', email: 'anita@example.com', phone: '+91 99887 76655', status: 'Active' },
  { name: 'Karan Singh', email: 'karan@example.com', phone: '+91 90000 11223', status: 'Pending' },
];

const accounts = [
  { account: 'SAV-1024', customer: 'Rahul Sharma', balance: 'Rs 1,25,000', type: 'Savings' },
  { account: 'CHK-2048', customer: 'Anita Mehta', balance: 'Rs 48,300', type: 'Checking' },
  { account: 'SAV-3092', customer: 'Karan Singh', balance: 'Rs 82,700', type: 'Savings' },
];

const transactions = [
  { ref: 'TXN-1001', type: 'Deposit', amount: '+Rs500', status: 'Success' },
  { ref: 'TXN-1002', type: 'Withdraw', amount: '-Rs300', status: 'Success' },
  { ref: 'TXN-1003', type: 'Transfer', amount: '-Rs1000', status: 'Pending' },
];

export default function AdminDashboard() {
  return (
    <div className="app-frame">
      <Sidebar />
      <div className="app-frame__stack">
        <Navbar />
        <main className="admin-shell admin-shell--stacked">
          <header className="admin-header">
            <div>
              <p className="admin-kicker">Admin Dashboard</p>
              <h1>Admin Dashboard</h1>
              <p className="admin-subtitle">Operational overview for the banking team.</p>
            </div>
            <Link to="/dashboard" className="admin-backlink">
              Back to Dashboard
            </Link>
          </header>

          <section className="admin-metrics" aria-label="Dashboard summary">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </section>

          <section className="admin-panels">
            <article className="admin-panel">
              <div className="admin-panel__header">
                <h2>Customers Table</h2>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.email}>
                        <td>{customer.name}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td>
                          <span className={`admin-status admin-status--${customer.status.toLowerCase()}`}>
                            {customer.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="admin-panel">
              <div className="admin-panel__header">
                <h2>Accounts Table</h2>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Account</th>
                      <th>Customer</th>
                      <th>Balance</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account) => (
                      <tr key={account.account}>
                        <td>{account.account}</td>
                        <td>{account.customer}</td>
                        <td>{account.balance}</td>
                        <td>{account.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="admin-panel admin-panel--wide">
              <div className="admin-panel__header">
                <h2>Transactions Table</h2>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.ref}>
                        <td>{transaction.ref}</td>
                        <td>{transaction.type}</td>
                        <td>{transaction.amount}</td>
                        <td>
                          <span className={`admin-status admin-status--${transaction.status.toLowerCase()}`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
