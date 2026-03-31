'use client';

import { useAppStore } from '@/store/useAppStore';
import { STELLAR_EXPERT_URL } from '@/lib/constants';
import { CheckCircle, XCircle, Loader, ExternalLink } from 'lucide-react';

export default function TxStatus() {
  const { tx, resetTx } = useAppStore();

  if (tx.status === 'idle') return null;

  const configs = {
    building: {
      cls: 'pending',
      icon: <Loader size={16} className="spinner" />,
      label: 'Building transaction…',
    },
    signing: {
      cls: 'pending',
      icon: <Loader size={16} className="spinner" />,
      label: 'Waiting for signature…',
    },
    pending: {
      cls: 'pending',
      icon: <Loader size={16} className="spinner" />,
      label: tx.message || 'Broadcasting to Stellar…',
    },
    success: {
      cls: 'success',
      icon: <CheckCircle size={16} />,
      label: tx.message || 'Transaction confirmed!',
    },
    error: {
      cls: 'error',
      icon: <XCircle size={16} />,
      label: tx.error || 'Transaction failed',
    },
  } as const;

  const cfg = configs[tx.status as keyof typeof configs];

  return (
    <div
      className={`tx-status ${cfg.cls}`}
      style={{ marginBottom: '1.5rem', position: 'relative' }}
    >
      {cfg.icon}
      <span style={{ flex: 1 }}>{cfg.label}</span>

      {tx.status === 'success' && tx.hash && (
        <a
          href={`${STELLAR_EXPERT_URL}/tx/${tx.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--accent-green)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none',
          }}
        >
          View TX <ExternalLink size={12} />
        </a>
      )}

      {(tx.status === 'success' || tx.status === 'error') && (
        <button
          onClick={resetTx}
          style={{
            background: 'none',
            border: 'none',
            color: 'currentColor',
            cursor: 'pointer',
            fontSize: '1rem',
            lineHeight: 1,
            padding: '0 0.25rem',
            opacity: 0.7,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
