import type { Viewport } from 'next';
import './polio.css';

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
};

export default function PolioLayout({ children }: { children: React.ReactNode }) {
  return <div className="polio min-h-screen">{children}</div>;
}
