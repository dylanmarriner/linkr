import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Linkr',
  description: 'Dark Luxury directory platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-charcoal text-white">{children}</body>
    </html>
  );
}
