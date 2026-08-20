import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '../components/layout/LayoutWrapper';
import QueryProvider from '../components/providers/QueryProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Kenmarie Technologies Ltd',
  description:
    'A trusted technology partner delivering innovative, secure, and reliable digital solutions that help organizations grow.',
  keywords: ['cloud deployment', 'web hosting', 'Azure solutions', 'DevOps', 'technology partner'],
  openGraph: {
    title: 'Kenmarie Technologies Ltd',
    description:
      'A trusted technology partner delivering innovative, secure, and reliable digital solutions that help organizations grow.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <QueryProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
