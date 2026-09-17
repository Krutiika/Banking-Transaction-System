import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Settings() {
  return (
    <div className="app-frame">
      <Sidebar />
      <div className="app-frame__stack">
        <Navbar />
        <main className="screen-shell screen-shell--stacked">
          <section className="screen-card">
            <div className="screen-header">
              <p className="screen-kicker">Settings</p>
              <h1>Settings</h1>
              <p className="profile-subtitle">Settings screen coming next.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
