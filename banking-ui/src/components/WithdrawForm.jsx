export default function WithdrawForm({ amount, onAmountChange, onSubmit, loading, error, message }) {
  return (
    <form className="withdraw-form" onSubmit={onSubmit}>
      <label className="withdraw-label" htmlFor="withdraw-amount">
        Amount
      </label>
      <input
        id="withdraw-amount"
        className="withdraw-input"
        type="number"
        min="0"
        step="0.01"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        disabled={loading}
      />

      {error && (
        <p className="withdraw-message withdraw-message--error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="withdraw-message withdraw-message--success" role="status">
          {message}
        </p>
      )}

      <button type="submit" className="withdraw-button" disabled={loading}>
        {loading ? 'Processing...' : 'Withdraw Button'}
      </button>
    </form>
  );
}
