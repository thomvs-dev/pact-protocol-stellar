'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import TxStatus from '@/components/TxStatus';
import AgentCard from '@/components/AgentCard';
import {
  getAgentProfile,
  getReputationScore,
  getAgentId,
  buildMintCreator,
  buildMintBrand,
  AgentProfile,
  ReputationScore,
} from '@/lib/contracts';
import { signWithFreighter } from '@/lib/freighter';
import { Users, UserPlus, Star, RefreshCw } from 'lucide-react';

const PLATFORMS = ['instagram', 'tiktok', 'youtube', 'twitter', 'twitch', 'x', 'other'];

export default function AgentsPage() {
  const { isWalletConnected, walletAddress, agentId, setAgent, tx, setTxStatus, submitTx } = useAppStore();

  const [tab, setTab] = useState<'my-profile' | 'register' | 'explore'>('my-profile');
  const [agentType, setAgentType] = useState<'Creator' | 'Brand'>('Creator');

  // Form state
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [followers, setFollowers] = useState('');
  const [brandName, setBrandName] = useState('');
  const [metaUri, setMetaUri] = useState('ipfs://QmPactProtocol');

  // Profile data
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [score, setScore] = useState<ReputationScore | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Explore
  const [exploreIds, setExploreIds] = useState<number[]>([]);
  const [exploreProfiles, setExploreProfiles] = useState<Record<number, { profile: AgentProfile; score: ReputationScore }>>({});
  const [loadingExplore, setLoadingExplore] = useState(false);

  useEffect(() => {
    if (agentId) loadProfile(agentId);
  }, [agentId]);

  async function loadProfile(id: number) {
    setLoadingProfile(true);
    try {
      const [p, s] = await Promise.all([getAgentProfile(id), getReputationScore(id)]);
      setProfile(p);
      setScore(s);
      setAgent(id, p.agent_type as 'Creator' | 'Brand');
    } catch (err) {
      console.error('Load profile error:', err);
    } finally {
      setLoadingProfile(false);
    }
  }

  async function loadExplore() {
    setLoadingExplore(true);
    try {
      const ids = Array.from({ length: 10 }, (_, i) => i + 1);
      const results: Record<number, { profile: AgentProfile; score: ReputationScore }> = {};
      await Promise.allSettled(
        ids.map(async (id) => {
          try {
            const [p, s] = await Promise.all([getAgentProfile(id), getReputationScore(id)]);
            results[id] = { profile: p, score: s };
          } catch {}
        })
      );
      const found = ids.filter((id) => results[id]);
      setExploreIds(found);
      setExploreProfiles(results);
    } finally {
      setLoadingExplore(false);
    }
  }

  useEffect(() => {
    if (tab === 'explore') loadExplore();
  }, [tab]);

  async function handleRegister() {
    if (!isWalletConnected || !walletAddress) return;
    setTxStatus('building');
    try {
      let xdr: string;
      if (agentType === 'Creator') {
        if (!handle || !followers) { alert('Fill all fields'); setTxStatus('idle'); return; }
        xdr = await buildMintCreator(
          walletAddress,
          handle,
          platform,
          metaUri || 'ipfs://QmPactProtocol',
          parseInt(followers)
        );
      } else {
        if (!brandName) { alert('Enter brand name'); setTxStatus('idle'); return; }
        xdr = await buildMintBrand(walletAddress, brandName, metaUri || 'ipfs://QmPactProtocol');
      }

      setTxStatus('signing');
      const signedXdr = await signWithFreighter(xdr);
      await submitTx(signedXdr);

      // Reload agent ID
      const id = await getAgentId(walletAddress);
      await loadProfile(id);
      setTab('my-profile');
    } catch (err: any) {
      if (tx.status !== 'error') {
        setTxStatus('error', { error: err.message });
      }
    }
  }

  async function refreshProfile() {
    if (walletAddress) {
      try {
        const id = await getAgentId(walletAddress);
        await loadProfile(id);
      } catch {
        setAgent(null, null);
      }
    }
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Page header */}
      <div className="section-eyebrow">AGENT REGISTRY</div>
      <div className="section-header">
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          AGENT<br />
          <span style={{ color: 'var(--accent-yellow)' }}>PROFILES</span>
        </h1>
        <button
          className="btn btn-ghost btn-sm"
          onClick={refreshProfile}
          disabled={!isWalletConnected}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <TxStatus />

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'my-profile' ? 'active' : ''}`} onClick={() => setTab('my-profile')}>
          My Profile
        </button>
        <button className={`tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>
          Register
        </button>
        <button className={`tab ${tab === 'explore' ? 'active' : ''}`} onClick={() => setTab('explore')}>
          Explore
        </button>
      </div>

      {/* My Profile */}
      {tab === 'my-profile' && (
        <div>
          {!isWalletConnected ? (
            <div className="card card-dim" style={{ textAlign: 'center', padding: '3rem', borderStyle: 'dashed' }}>
              <Users size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Connect Your Wallet</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Connect Freighter to view your agent profile.
              </p>
            </div>
          ) : loadingProfile ? (
            <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              Loading profile…
            </div>
          ) : profile && score && agentId ? (
            <div>
              <AgentCard id={agentId} profile={profile} score={score} isCurrentUser />
              <div style={{ marginTop: '1rem' }}>
                <div
                  style={{
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-dim)',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <strong style={{ color: 'var(--text-primary)' }}>How to improve your tier:</strong>
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem', lineHeight: 2 }}>
                    <li>🥈 Silver — 5+ deals, 70%+ success rate</li>
                    <li>🥇 Gold — 20+ deals, 80%+ success rate</li>
                    <li>💎 Diamond — 50+ deals, 90%+ success rate</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="card card-dim" style={{ textAlign: 'center', padding: '3rem', borderStyle: 'dashed' }}>
              <UserPlus size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Not Registered Yet</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                You don't have an on-chain agent profile. Register to start making deals.
              </p>
              <button className="btn" onClick={() => setTab('register')}>
                Register Now →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Register */}
      {tab === 'register' && (
        <div style={{ maxWidth: '540px' }}>
          {!isWalletConnected ? (
            <div className="card card-dim" style={{ textAlign: 'center', padding: '2rem', borderStyle: 'dashed' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Connect your wallet first.</p>
            </div>
          ) : agentId ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <Star size={32} style={{ color: 'var(--accent-yellow)', margin: '0 auto 1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Already Registered</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                You are Agent #{agentId}. Go to My Profile to view your stats.
              </p>
              <button className="btn" onClick={() => setTab('my-profile')}>
                View Profile →
              </button>
            </div>
          ) : (
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>REGISTER AGENT</h3>

              {/* Type toggle */}
              <div style={{ display: 'flex', gap: '2px', marginBottom: '1.5rem' }}>
                {(['Creator', 'Brand'] as const).map((type) => (
                  <button
                    key={type}
                    className={`btn ${agentType === type ? '' : 'btn-ghost'} btn-sm`}
                    style={{ flex: 1 }}
                    onClick={() => setAgentType(type)}
                  >
                    {type === 'Creator' ? '🎨' : '🏢'} {type}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {agentType === 'Creator' ? (
                  <>
                    <div className="input-group">
                      <label>Handle / Username</label>
                      <input
                        className="input"
                        placeholder="@yourcreatorhandle"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Platform</label>
                      <select className="input" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                        {PLATFORMS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Follower Count</label>
                      <input
                        className="input"
                        placeholder="250000"
                        type="number"
                        min="0"
                        value={followers}
                        onChange={(e) => setFollowers(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="input-group">
                    <label>Brand Name</label>
                    <input
                      className="input"
                      placeholder="Acme Corp"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                    />
                  </div>
                )}

                <div className="input-group">
                  <label>Metadata URI (optional)</label>
                  <input
                    className="input"
                    placeholder="ipfs://Qm..."
                    value={metaUri}
                    onChange={(e) => setMetaUri(e.target.value)}
                  />
                  <span className="hint">IPFS URI pointing to agent metadata JSON</span>
                </div>

                <button
                  className="btn"
                  onClick={handleRegister}
                  disabled={tx.status === 'pending' || tx.status === 'building' || tx.status === 'signing'}
                  style={{ marginTop: '0.5rem' }}
                >
                  {tx.status === 'building' || tx.status === 'signing' || tx.status === 'pending'
                    ? 'Processing…'
                    : `MINT ${agentType.toUpperCase()} AGENT`}
                </button>
              </div>

              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-dim)',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                }}
              >
                ⚠️ This transaction requires Freighter wallet signing. Make sure you're on Testnet.
                Get test XLM from{' '}
                <a
                  href={`https://friendbot.stellar.org?addr=${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-yellow)' }}
                >
                  Friendbot
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Explore */}
      {tab === 'explore' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Scanning on-chain agents (IDs 1–10)…
            </div>
            <button className="btn btn-ghost btn-sm" onClick={loadExplore} disabled={loadingExplore}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {loadingExplore ? (
            <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              Fetching from Soroban RPC…
            </div>
          ) : exploreIds.length === 0 ? (
            <div className="card card-dim" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No agents found on testnet yet.</p>
            </div>
          ) : (
            <div className="grid-3">
              {exploreIds.map((id) => {
                const data = exploreProfiles[id];
                return (
                  <AgentCard
                    key={id}
                    id={id}
                    profile={data.profile}
                    score={data.score}
                    isCurrentUser={id === agentId}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
