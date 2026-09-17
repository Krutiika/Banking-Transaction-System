export default function AccountCard({ account, number, balance, status }) {
  return (
    <article className="account-card">
      <div>
        <p className="account-card__name">{account}</p>
        <p className="account-card__number">{number}</p>
      </div>
      <div className="account-card__meta">
        <p className="account-card__balance">{balance}</p>
        <span className={`account-card__status account-card__status--${status.toLowerCase()}`}>{status}</span>
      </div>
    </article>
  );
}
