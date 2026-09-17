import { useState } from 'react';
import { Link } from 'react-router-dom';
import { transferApi } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TransferForm from '../components/TransferForm';

export default function Transfer() {
  const [form, setForm] = useState({
    receiverAccountNumber: '',
    amount: '',
    remarks: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await transferApi(
        {
          receiverAccountNumber: form.receiverAccountNumber.trim(),
          amount: form.amount.trim(),
          remarks: form.remarks.trim(),
        },
      );
      setMessage(res.message || 'Transfer successful.');
      setForm({ receiverAccountNumber: '', amount: '', remarks: '' });
    } catch (err) {
      setError(err.message || 'Transfer failed. Please try again.');
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
          <div className="feature-card feature-card--transfer">
            <p className="feature-kicker">Transfer</p>
            <h1>Transfer Money</h1>

            <TransferForm
              form={form}
              onChange={handleChange}
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
