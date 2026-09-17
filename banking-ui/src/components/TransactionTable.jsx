export default function TransactionTable({ rows, columns = ['Date', 'Type', 'Amount', 'Status'] }) {
  return (
    <div className="transactions-table-wrap">
      <table className="transactions-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key || `${row.date}-${row.type}`}>
              <td>{row.date}</td>
              <td>{row.type}</td>
              <td className={`transactions-amount transactions-amount--${row.tone}`}>{row.amount}</td>
              <td>
                <span className="transactions-status">{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
