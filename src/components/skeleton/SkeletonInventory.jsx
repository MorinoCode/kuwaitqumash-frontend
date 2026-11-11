import React from 'react';
import Skeleton from './Skeleton';
import './SkeletonInventory.css';

const ROW_COUNT = 8;
const CARD_COUNT = 5;

export function SkeletonInventoryTableRows({ theme = 'dark' }) {
  return (
    <>
      {Array.from({ length: ROW_COUNT }, (_, i) => (
        <tr key={i} className={`skeleton-inventory-row inventory-item inventory-item--${theme}`}>
          <td className="inventory-item__cell inventory-item__cell--image">
            <Skeleton width="48px" height="48px" circle />
          </td>
          <td className="inventory-item__cell inventory-item__cell--info">
            <div className="inventory-item__info">
              <Skeleton width="140px" height="1rem" />
              <div className="inventory-item__meta" style={{ marginTop: '0.35rem' }}>
                <Skeleton width="80px" height="0.75rem" />
              </div>
            </div>
          </td>
          <td className="inventory-item__cell">
            <Skeleton width="52px" height="1rem" />
          </td>
          <td className="inventory-item__cell">
            <Skeleton width="36px" height="1.25rem" />
          </td>
          <td className="inventory-item__cell">
            <Skeleton width="44px" height="1rem" />
          </td>
          <td className="inventory-item__cell">
            <Skeleton width="24px" height="1rem" />
          </td>
          <td className="inventory-item__cell">
            <Skeleton width="64px" height="1rem" />
          </td>
          <td className="inventory-item__cell">
            <Skeleton width="64px" height="1rem" />
          </td>
          <td className="inventory-item__cell">
            <Skeleton width="56px" height="1rem" />
          </td>
          <td className="inventory-item__cell">
            <div className="inventory-item__actions-group">
              <Skeleton width="32px" height="32px" />
              <Skeleton width="32px" height="32px" />
              <Skeleton width="32px" height="32px" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export function SkeletonInventoryCards() {
  return (
    <>
      {Array.from({ length: CARD_COUNT }, (_, i) => (
        <div key={i} className="inventory-mobile-card skeleton-inventory-card">
          <div className="inventory-mobile-card__header">
            <div className="inventory-mobile-card__image">
              <Skeleton width="100%" height="100%" />
            </div>
            <div className="inventory-mobile-card__info">
              <div className="inventory-mobile-card__name">
                <Skeleton width="120px" height="1rem" />
              </div>
              <div className="inventory-mobile-card__meta">
                <Skeleton width="90px" height="0.8rem" />
              </div>
            </div>
            <div className="inventory-mobile-card__actions">
              <Skeleton width="32px" height="32px" />
              <Skeleton width="32px" height="32px" />
              <Skeleton width="32px" height="32px" />
            </div>
          </div>
          <div className="inventory-mobile-card__details">
            {Array.from({ length: 7 }, (__, j) => (
              <div key={j} className="inventory-mobile-card__detail-item">
                <span className="inventory-mobile-card__detail-label">
                  <Skeleton width="56px" height="0.75rem" />
                </span>
                <span className="inventory-mobile-card__detail-value">
                  <Skeleton width="48px" height="0.9rem" />
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
