export default function TransferForm({ form, onChange, onSubmit, loading, error, message }) {
  return (
    <form className="transfer-form" onSubmit={onSubmit}>
      <label className="transfer-label" htmlFor="transfer-receiver">
        Receiver Account Number
      </label>
      <input
        id="transfer-receiver"
        className="transfer-input"
        type="text"
        name="receiverAccountNumber"
        placeholder="Enter receiver account number"
        value={form.receiverAccountNumber}
        onChange={onChange}
        disabled={loading}
      />

      <label className="transfer-label" htmlFor="transfer-amount">
        Amount
      </label>
      <input
        id="transfer-amount"
        className="transfer-input"
        type="number"
        min="0"
        step="0.01"
        name="amount"
        placeholder="Enter amount"
        value={form.amount}
        onChange={onChange}
        disabled={loading}
      />

      <label className="transfer-label" htmlFor="transfer-remarks">
        Remarks
      </label>
      <input
        id="transfer-remarks"
        className="transfer-input"
        type="text"
        name="remarks"
        placeholder="Add a note"
        value={form.remarks}
        onChange={onChange}
        disabled={loading}
      />

      {error && (
        <p className="transfer-message transfer-message--error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="transfer-message transfer-message--success" role="status">
          {message}
        </p>
      )}

      <button type="submit" className="transfer-button" disabled={loading}>
        {loading ? 'Processing...' : 'Transfer Button'}
      </button>
    </form>
  );
}
