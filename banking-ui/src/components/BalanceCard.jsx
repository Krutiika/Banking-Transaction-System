export default function BalanceCard({ amount, label = 'Current Balance', chip = 'Available now' }) {
  return (
    <section className="dashboard-panel dashboard-balance">
      <div>
        <p className="dashboard-label">{label}</p>
        <p className="dashboard-amount">{amount}</p>
      </div>
      <div className="dashboard-balance__chip">{chip}</div>
    </section>
  );
}
