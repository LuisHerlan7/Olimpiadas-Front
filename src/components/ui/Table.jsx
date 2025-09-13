import React from 'react';
import { clsx } from 'clsx';

const Table = ({ 
  headers = [], 
  data = [], 
  className = '',
  emptyMessage = 'No hay datos disponibles',
  onRowClick = null,
  loading = false,
  striped = true,
  hoverable = true
}) => {
  const tableClasses = clsx(
    'min-w-full divide-y divide-gray-200',
    className
  );

  const rowClasses = clsx(
    'table-row',
    {
      'cursor-pointer': onRowClick,
      'hover:bg-accent-soft-blue': hoverable
    }
  );

  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className={tableClasses}>
          <thead className="table-header">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="table-row">
                {headers.map((_, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                    <div className="loading h-4 w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className={tableClasses}>
        <thead className="table-header">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-6 py-12 text-center text-gray-500"
              >
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900 mb-1">Sin datos</p>
                  <p className="text-sm text-gray-500">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowClasses}
                onClick={() => onRowClick && onRowClick(row, rowIndex)}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {cell}
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

