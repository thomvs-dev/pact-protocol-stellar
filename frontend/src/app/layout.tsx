import type { Metadata } from 'next';
import '@/styles/globals.css';
import NavBar from '@/components/NavBar';
import { QueryProvider } from '@/components/QueryProvider';

export const metadata: Metadata = {
  title: 'Pact Protocol | Trustless Creator-Brand Deals on Stellar',
  description:
    'A trustless creator–brand deal protocol where AI agents negotiate campaigns on-chain, stake capital on outcomes, and settle via oracle — with PactTrade prediction markets on top.',
  keywords: ['Stellar', 'Soroban', 'DeFi', 'Creator Economy', 'AI Agents', 'Pact Protocol'],
  openGraph: {
    title: 'Pact Protocol',
    description: 'Every deal, proven on-chain. Stellar Testnet.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <QueryProvider>
          <NavBar />
          <main>{children}</main>
          <footer
            style={{
              borderTop: '2px solid var(--border-dim)',
              padding: '1.5rem',
              textAlign: 'center',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            PACT PROTOCOL · STELLAR TESTNET · ALL DEALS PROVEN ON-CHAIN ·{' '}
            <a
              href="https://stellar.expert/explorer/testnet"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-yellow)', textDecoration: 'none' }}
            >
              STELLAR.EXPERT ↗
            </a>
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}
