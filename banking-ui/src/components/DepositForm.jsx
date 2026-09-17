export default function DepositForm({ amount, onAmountChange, onSubmit, loading, error, message }) {
  return (
    <form className="deposit-form" onSubmit={onSubmit}>
      <label className="deposit-label" htmlFor="deposit-amount">
        Amount
      </label>
      <input
        id="deposit-amount"
        className="deposit-input"
        type="number"
        min="0"
        step="0.01"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        disabled={loading}
      />

      {error && (
        <p className="deposit-message deposit-message--error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="deposit-message deposit-message--success" role="status">
          {message}
        </p>
      )}

      <button type="submit" className="deposit-button" disabled={loading}>
        {loading ? 'Processing...' : 'Deposit Button'}
      </button>
    </form>
  );
}
