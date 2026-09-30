import type { Metadata } from 'next';
import { AdminCRM } from './AdminCRM';

export const metadata: Metadata = {
  title: { absolute: 'CRM · Pamplona contra la Polio 2026' },
  robots: { index: false, follow: false },
};

export default function PolioAdminPage() {
  return <AdminCRM />;
}
