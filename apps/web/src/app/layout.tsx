import type { Metadata } from 'next';
import { QueryProvider } from '@/providers/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Boots Health Checks',
  description: 'Your personalised health check journey with Boots',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <QueryProvider>
          <header className="bg-primary text-primary-foreground">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">B</span>
                </div>
                <h1 className="text-xl font-semibold">Boots Health Checks</h1>
              </div>
              <nav className="hidden md:flex gap-6 text-sm">
                <a href="/" className="hover:underline">Home</a>
                <a href="/pharmacy" className="hover:underline">Pharmacy Console</a>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="bg-muted border-t border-border">
            <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
              &copy; 2026 Boots UK Limited. All rights reserved. | Health Check
              Platform v1.0 (Prototype)
            </div>
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}
