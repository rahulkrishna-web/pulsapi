'use client';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import StoreConnectForm from './components/storeConnectForm';

export default function Home() {
  const searchParams = useSearchParams();
  const shop = searchParams.get('shop');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
    {shop}
    <StoreConnectForm />
    </>
  );
}
