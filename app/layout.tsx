import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vyala Archon — Post-Quantum Cryptography Intelligence',
  description:
    'Enterprise-grade cryptographic supply chain vulnerability mapping powered by post-quantum cryptography analysis.',
  keywords: ['PQC', 'cryptography', 'quantum', 'vulnerability', 'supply chain', 'security'],
  authors: [{ name: 'Vyala Security' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Vyala Archon',
    description: 'Post-Quantum Cryptography Vulnerability Intelligence',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {/* Ambient background orbs */}
        <div
          className="orb w-[600px] h-[600px] top-[-200px] left-[-200px]"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)' }}
        />
        <div
          className="orb w-[500px] h-[500px] bottom-[-100px] right-[-100px]"
          style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.03) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
