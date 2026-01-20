import React from 'react';
import './Table.css';

const Table = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  striped = false,
  hoverable = true,
  compact = false,
  className = '',
}) => {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="table-loading__spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      <table className={`table ${striped ? 'table--striped' : ''} ${hoverable ? 'table--hoverable' : ''} ${compact ? 'table--compact' : ''}`}>
        <thead className="table__head">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="table__header"
                style={{ width: column.width, textAlign: column.align || 'left' }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table__body">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="table__row">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="table__cell"
                    style={{ textAlign: column.align || 'left' }}
                  >
                    {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
