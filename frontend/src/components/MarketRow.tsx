'use client';

import { Market } from '@/lib/contracts';
import { formatUsdc } from '@/lib/stellar';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  dealId: number;
  market: Market;
  yesPrice: number; // 0–1000
  onBuy: (dealId: number, isYes: boolean) => void;
  onRedeem: (dealId: number) => void;
  disabled?: boolean;
}

export default function MarketRow({ dealId, market, yesPrice, onBuy, onRedeem, disabled }: Props) {
  const yesPercent = yesPrice / 10; // convert 0-1000 -> 0%-100%
  const noPercent = 100 - yesPercent;

  const totalLiq = formatUsdc(market.total_liquidity);

  return (
    <div className="card card-dim" style={{ padding: '1rem' }}>
      <div className="flex items-center justify-between mb-2">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          DEAL #{dealId} MARKET
        </div>
        <div className={`badge ${market.settled ? 'badge-green' : 'badge-yellow'}`}>
          {market.settled ? (market.outcome ? 'YES WON' : 'NO WON') : 'LIVE'}
        </div>
      </div>

      {/* Price bars */}
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            display: 'flex',
            height: '32px',
            border: '1px solid var(--border-dim)',
            overflow: 'hidden',
            marginBottom: '0.4rem',
          }}
        >
          <div
            style={{
              width: `${yesPercent}%`,
              background: 'var(--accent-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 800,
              color: '#000',
              transition: 'width 0.5s ease',
            }}
          >
            {yesPercent > 15 ? `YES ${yesPercent.toFixed(1)}%` : ''}
          </div>
          <div
            style={{
              flex: 1,
              background: 'var(--accent-pink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 800,
              color: '#fff',
              transition: 'width 0.5s ease',
            }}
          >
            {noPercent > 15 ? `NO ${noPercent.toFixed(1)}%` : ''}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>Liquidity: <strong style={{ color: 'var(--text-primary)' }}>${totalLiq}</strong></span>
          <span>
            YES: ${formatUsdc(market.yes_reserve)} · NO: ${formatUsdc(market.no_reserve)}
          </span>
        </div>
      </div>

      {/* Actions */}
      {market.settled ? (
        <button
          className="btn btn-blue btn-sm w-full"
          onClick={() => onRedeem(dealId)}
          disabled={disabled}
        >
          Redeem Position
        </button>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-sm"
            style={{ flex: 1, background: 'var(--accent-green)', borderColor: 'var(--accent-green)', color: '#000' }}
            onClick={() => onBuy(dealId, true)}
            disabled={disabled}
          >
            <TrendingUp size={12} /> Buy YES
          </button>
          <button
            className="btn btn-pink btn-sm"
            style={{ flex: 1 }}
            onClick={() => onBuy(dealId, false)}
            disabled={disabled}
          >
            <TrendingDown size={12} /> Buy NO
          </button>
        </div>
      )}
    </div>
  );
}
