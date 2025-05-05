"use client";

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/ui/navbar';
import { ReactNode } from 'react';

interface NavbarWrapperProps {
  children: ReactNode;
}

export function NavbarWrapper({ children }: NavbarWrapperProps) {
  const pathname = usePathname();
  const showNavbar = pathname !== '/chat';

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
} 