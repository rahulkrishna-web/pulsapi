'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [storeUrl, setStoreUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if session is authenticated when component mounts
    const checkSession = async () => {
      try {
        const response = await fetch('https://eventsguy.clyrix.com/api/check-auth', {
          method: 'GET',
          credentials: 'include', // Send cookies with request
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.isAuthenticated);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkSession();
  }, []);

  const handleStoreUrlChange = (e) => {
    setStoreUrl(e.target.value);
  };

  const connectStore = async () => {
    if (!storeUrl) {
      return console.log("No store URL entered.");
    }

    setLoading(true);
    setError(null);

    const apiKey = process.env.SHOPIFY_API_KEY;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
    const scopes = process.env.NEXT_PUBLIC_SHOPIFY_SCOPES;
    const state = Math.random().toString(36).substring(2);

    try {
      const data = { shop_url: storeUrl, state };

      const response = await fetch('https://eventsguy.clyrix.com/api/store-shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.status === 'created' || result.status === 'exists') {
        const authUrl = `https://${storeUrl}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;
        window.location.href = authUrl;
      } else {
        console.log("Unexpected status: ", result.status);
      }
    } catch (error) {
      console.error("Error during request:", error);
      setError('Failed to connect the store. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {isAuthenticated ? (
          <div>
            <h2 className="text-2xl">Welcome to Your Dashboard</h2>
            <p>Here, you can manage your stores events and settings.</p>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter Store URL"
              value={storeUrl}
              onChange={handleStoreUrlChange}
              className="border rounded-l px-4 py-2 w-64 focus:outline-none focus:ring focus:border-blue-300"
            />

            <button
              onClick={connectStore}
              disabled={loading}
              className={`bg-blue-500 text-white rounded-r px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 ${loading && 'opacity-50 cursor-not-allowed'}`}
            >
              {loading ? 'Connecting...' : 'Connect'}
            </button>
          </>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>
    </div>
  );
}
