'use client';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import StoreConnectForm from './components/storeConnectForm';
import Dashboard from './components/Dashboard';

export default function Home() {
  const searchParams = useSearchParams();
  const shop = searchParams.get('shop');

  return (
    <>
    {shop ? <Dashboard /> : <StoreConnectForm />}
    </>
  );
}
