import type { Metadata } from "next";

// Covers ALL of /admin (including /admin/login, which is a client component
// and can't export metadata itself): never index the admin.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
