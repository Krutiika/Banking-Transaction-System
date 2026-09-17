export default function TransactionCard({ type, amount, note, tone }) {
  return (
    <div className="dashboard-transaction">
      <div>
        <p className="dashboard-transaction__type">{type}</p>
        <p className="dashboard-transaction__note">{note}</p>
      </div>
      <p className={`dashboard-transaction__amount dashboard-transaction__amount--${tone}`}>
        {amount}
      </p>
    </div>
  );
}
