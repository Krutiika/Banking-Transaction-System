import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({
      fullName: user?.fullName || 'Customer Name',
      email: user?.email || '',
      phone: '',
      address: '',
    });
  }, [user]);

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
      const res = await updateProfileApi(
        {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
        },
      );
      if (res?.user) {
        updateUser(res.user);
      }
      setMessage(res.message || 'Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Profile update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-frame">
      <Sidebar />
      <div className="app-frame__stack">
        <Navbar />
        <main className="profile-shell profile-shell--stacked">
          <section className="profile-card">
            <div className="profile-header">
              <p className="profile-kicker">Profile</p>
              <h1>Profile</h1>
              <p className="profile-subtitle">Manage your customer details.</p>
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
              <label className="profile-label" htmlFor="profile-name">Full Name</label>
              <input
                id="profile-name"
                className="profile-input"
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                disabled={loading}
              />

              <label className="profile-label" htmlFor="profile-email">Email</label>
              <input
                id="profile-email"
                className="profile-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
              />

              <label className="profile-label" htmlFor="profile-phone">Phone</label>
              <input
                id="profile-phone"
                className="profile-input"
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                disabled={loading}
              />

              <label className="profile-label" htmlFor="profile-address">Address</label>
              <textarea
                id="profile-address"
                className="profile-input profile-textarea"
                name="address"
                placeholder="Enter address"
                rows={3}
                value={form.address}
                onChange={handleChange}
                disabled={loading}
              />

              {error && (
                <p className="profile-message profile-message--error" role="alert">
                  {error}
                </p>
              )}
              {message && (
                <p className="profile-message profile-message--success" role="status">
                  {message}
                </p>
              )}

              <button type="submit" className="profile-button" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>

            <div className="feature-footer">
              <Link to="/dashboard" className="feature-backlink">
                Back to Dashboard
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
