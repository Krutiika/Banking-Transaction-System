import { useState } from 'react';
import { Link } from 'react-router-dom';
import { depositApi } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DepositForm from '../components/DepositForm';

export default function Deposit() {
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
      const res = await depositApi(amount.trim());
      setMessage(res.message || 'Deposit successful.');
      setAmount('');
    } catch (err) {
      setError(err.message || 'Deposit failed. Please try again.');
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
          <div className="feature-card feature-card--deposit">
            <p className="feature-kicker">Deposit</p>
            <h1>Deposit Money</h1>

            <DepositForm
              amount={amount}
              onAmountChange={setAmount}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              message={message}
            />

            <div className="feature-divider" aria-hidden="true" />

            

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
