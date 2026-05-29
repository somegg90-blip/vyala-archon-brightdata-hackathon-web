import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // <-- Import Next.js font optimizer
import './globals.css';

// Configure the fonts
const geistSans = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans', // Creates a CSS variable so Tailwind can use it
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

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
    // Apply the font CSS variables to the <html> tag
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      {/* You no longer need the <head> links for fonts! Next.js handles it */}
      <body className={`${geistSans.className} antialiased`}>
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