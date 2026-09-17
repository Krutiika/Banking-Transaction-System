import { useState } from 'react';
import { Link } from 'react-router-dom';
import { withdrawApi } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import WithdrawForm from '../components/WithdrawForm';

export default function Withdraw() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await withdrawApi(amount.trim());
      setMessage(res.message || 'Withdraw successful.');
      setAmount('');
    } catch (err) {
      setError(err.message || 'Withdraw failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-frame">
      <Sidebar />
      <div className="app-frame__stack">
        <Navbar />
        <main className="feature-page feature-page--stacked">
          <div className="feature-card feature-card--withdraw">
            <p className="feature-kicker">Withdraw</p>
            <h1>Withdraw Money</h1>

            <WithdrawForm
              amount={amount}
              onAmountChange={setAmount}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              message={message}
            />

            <div className="feature-divider" aria-hidden="true" />

            <div className="feature-api">
              <span>API</span>
              <code>POST /withdraw</code>
            </div>

            <div className="feature-footer">
              <Link to="/dashboard" className="feature-backlink">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
