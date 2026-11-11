import React from 'react';
import Skeleton from './Skeleton';
import './SkeletonCustomers.css';

const ROW_COUNT = 8;

export function SkeletonCustomersTableRows() {
  return (
    <>
      {Array.from({ length: ROW_COUNT }, (_, i) => (
        <tr key={i} className="skeleton-customers-row customers-table__row">
          <td className="customers-table__cell customers-table__cell--name">
            <Skeleton width="140px" height="1rem" />
          </td>
          <td className="customers-table__cell">
            <Skeleton width="110px" height="1rem" />
          </td>
          <td className="customers-table__cell">
            <Skeleton width="100px" height="1rem" />
          </td>
          <td className="customers-table__cell">
            <Skeleton width="64px" height="1.5rem" />
          </td>
          <td className="customers-table__cell customers-table__cell--actions">
            <div className="customers-table__actions-group">
              <Skeleton width="32px" height="32px" />
              <Skeleton width="32px" height="32px" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
