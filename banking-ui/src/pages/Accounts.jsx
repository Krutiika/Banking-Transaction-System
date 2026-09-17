import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AccountCard from '../components/AccountCard';

const accounts = [
  { account: 'Savings', number: 'ACC-1024', balance: 'Rs15,200', status: 'Active' },
  { account: 'Checking', number: 'ACC-2048', balance: 'Rs10,300', status: 'Active' },
  { account: 'Investment', number: 'ACC-3055', balance: 'Rs4,600', status: 'Pending' },
];

export default function Accounts() {
  return (
    <div className="app-frame">
      <Sidebar />
      <div className="app-frame__stack">
        <Navbar />
        <main className="screen-shell screen-shell--stacked">
          <section className="screen-card">
            <div className="screen-header">
              <p className="screen-kicker">Accounts</p>
              <h1>Accounts</h1>
              <p className="screen-subtitle">View all customer accounts at a glance.</p>
            </div>

            <div className="account-grid">
              {accounts.map((account) => (
                <AccountCard key={account.number} {...account} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
