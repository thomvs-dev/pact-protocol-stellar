'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import TxStatus from '@/components/TxStatus';
import DealCard from '@/components/DealCard';
import {
  getDeal,
  buildCreateDeal,
  Deal,
} from '@/lib/contracts';
import { parseUsdc } from '@/lib/stellar';
import { Briefcase, Plus, RefreshCw, AlertCircle } from 'lucide-react';

export default function DealsPage() {
  const { isWalletConnected, walletAddress, agentId, tx, setTxStatus, submitTx } = useAppStore();

  const [tab, setTab] = useState<'list' | 'create'>('list');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);

  // Create deal form
  const [creatorId, setCreatorId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [payment, setPayment] = useState('');
  const [creatorStake, setCreatorStake] = useState('');
  const [brandStake, setBrandStake] = useState('');
  const [creatorWallet, setCreatorWallet] = useState('');
  const [brandWallet, setBrandWallet] = useState('');
  const [daysFromNow, setDaysFromNow] = useState('30');

  // Auto-fill wallet address
  useEffect(() => {
    if (walletAddress) setCreatorWallet(walletAddress);
  }, [walletAddress]);

  useEffect(() => {
    loadDeals();
  }, []);

  async function loadDeals() {
    setLoading(true);
    const found: Deal[] = [];
    await Promise.allSettled(
      Array.from({ length: 20 }, (_, i) => i + 1).map(async (id) => {
        try {
          const deal = await getDeal(id);
          found.push(deal);
        } catch {}
      })
    );
    found.sort((a, b) => b.deal_id - a.deal_id);
    setDeals(found);
    setLoading(false);
  }

  async function handleCreateDeal() {
    if (!isWalletConnected || !walletAddress) return;
    if (!creatorId || !brandId || !payment || !creatorStake || !brandStake || !creatorWallet || !brandWallet) {
      alert('Please fill all required fields');
      return;
    }

    setTxStatus('building');
    try {
      const deadlineSec = BigInt(Math.floor(Date.now() / 1000) + parseInt(daysFromNow) * 86400);

      const xdr = await buildCreateDeal(
        walletAddress,
        parseInt(creatorId),
        parseInt(brandId),
        parseUsdc(payment),
        parseUsdc(creatorStake),
        parseUsdc(brandStake),
        deadlineSec,
        creatorWallet,
        brandWallet
      );

      setTxStatus('signing');
      const { signTransaction } = await import('@stellar/freighter-api');
      const signResult = await signTransaction(xdr, {
        networkPassphrase: 'Test SDF Network ; September 2015',
      });
      if (signResult.error) throw new Error(signResult.error.message);

      await submitTx(signResult.signedTxXdr);
      await loadDeals();
      setTab('list');
    } catch (err: any) {
      if (tx.status !== 'error') setTxStatus('error', { error: err.message });
    }
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div className="section-eyebrow">DEAL VAULT</div>
      <div className="section-header">
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          ACTIVE<br />
          <span style={{ color: 'var(--accent-yellow)' }}>DEALS</span>
        </h1>
        <button
          className="btn btn-ghost btn-sm"
          onClick={loadDeals}
          disabled={loading}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <TxStatus />

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'list' ? 'active' : ''}`} onClick={() => setTab('list')}>
          <Briefcase size={12} style={{ display: 'inline', marginRight: '4px' }} />
          All Deals ({deals.length})
        </button>
        <button className={`tab ${tab === 'create' ? 'active' : ''}`} onClick={() => setTab('create')}>
          <Plus size={12} style={{ display: 'inline', marginRight: '4px' }} />
          Create Deal
        </button>
      </div>

      {/* Deals List */}
      {tab === 'list' && (
        <div>
          {loading ? (
            <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              Scanning deal vault (IDs 1–20)…
            </div>
          ) : deals.length === 0 ? (
            <div className="card card-dim" style={{ textAlign: 'center', padding: '3rem', borderStyle: 'dashed' }}>
              <Briefcase size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>No Deals Yet</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Be the first to create a deal on Pact Protocol.
              </p>
              <button className="btn" onClick={() => setTab('create')}>
                Create First Deal →
              </button>
            </div>
          ) : (
            <div className="grid-2">
              {deals.map((deal) => (
                <DealCard key={deal.deal_id} deal={deal} highlight={
                  deal.creator_wallet === walletAddress || deal.brand_wallet === walletAddress
                } />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Deal Form */}
      {tab === 'create' && (
        <div style={{ maxWidth: '600px' }}>
          {!isWalletConnected ? (
            <div className="card card-dim" style={{ textAlign: 'center', padding: '2rem', borderStyle: 'dashed' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Connect your wallet to create a deal.</p>
            </div>
          ) : (
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>CREATE DEAL</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Agent IDs */}
                <div className="grid-2" style={{ gap: '0.75rem' }}>
                  <div className="input-group">
                    <label>Creator Agent ID</label>
                    <input
                      className="input"
                      placeholder="e.g. 1"
                      type="number"
                      min="1"
                      value={creatorId}
                      onChange={(e) => setCreatorId(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Brand Agent ID</label>
                    <input
                      className="input"
                      placeholder="e.g. 2"
                      type="number"
                      min="1"
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                    />
                  </div>
                </div>

                {/* Wallets */}
                <div className="input-group">
                  <label>Creator Wallet Address</label>
                  <input
                    className="input"
                    placeholder="G..."
                    value={creatorWallet}
                    onChange={(e) => setCreatorWallet(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Brand Wallet Address</label>
                  <input
                    className="input"
                    placeholder="G..."
                    value={brandWallet}
                    onChange={(e) => setBrandWallet(e.target.value)}
                  />
                </div>

                {/* Payment & Stakes */}
                <div
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-dim)',
                    padding: '1rem',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--text-secondary)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Financials (USDC)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="input-group">
                      <label>Payment (USDC to Creator on success)</label>
                      <input
                        className="input"
                        placeholder="100.00"
                        type="number"
                        step="0.01"
                        min="0"
                        value={payment}
                        onChange={(e) => setPayment(e.target.value)}
                      />
                    </div>
                    <div className="grid-2" style={{ gap: '0.75rem' }}>
                      <div className="input-group">
                        <label>Creator Stake (USDC)</label>
                        <input
                          className="input"
                          placeholder="20.00"
                          type="number"
                          step="0.01"
                          min="0"
                          value={creatorStake}
                          onChange={(e) => setCreatorStake(e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label>Brand Stake (USDC)</label>
                        <input
                          className="input"
                          placeholder="30.00"
                          type="number"
                          step="0.01"
                          min="0"
                          value={brandStake}
                          onChange={(e) => setBrandStake(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deadline */}
                <div className="input-group">
                  <label>Deadline (days from now)</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    max="365"
                    value={daysFromNow}
                    onChange={(e) => setDaysFromNow(e.target.value)}
                  />
                  <span className="hint">
                    Deadline: {new Date(Date.now() + parseInt(daysFromNow || '30') * 86400000).toLocaleDateString()}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    background: 'rgba(255, 230, 0, 0.05)',
                    border: '1px solid rgba(255, 230, 0, 0.2)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <AlertCircle size={14} style={{ color: 'var(--accent-yellow)', flexShrink: 0, marginTop: '1px' }} />
                  <span>
                    Both wallets must sign this transaction. Creator and Brand must use the same deal ID when depositing stakes.
                    20% of creator stake is slashed on failed delivery.
                  </span>
                </div>

                <button
                  className="btn"
                  onClick={handleCreateDeal}
                  disabled={tx.status === 'pending' || tx.status === 'building' || tx.status === 'signing'}
                >
                  {tx.status === 'building' || tx.status === 'signing' || tx.status === 'pending'
                    ? 'Processing…'
                    : 'CREATE DEAL ON-CHAIN'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
