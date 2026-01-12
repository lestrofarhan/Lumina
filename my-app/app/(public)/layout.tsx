import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import React from 'react'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
    }) {
    
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}

