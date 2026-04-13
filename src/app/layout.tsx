import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arandu Nexus',
  description: 'Workspace de arquitetura com boards persistidos e canvas para raciocinio visual.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
