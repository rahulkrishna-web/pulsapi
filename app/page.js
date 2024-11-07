'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [storeUrl, setStoreUrl] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading
  const [error, setError] = useState(null); // To track errors

  const handleStoreUrlChange = (e) => {
    setStoreUrl(e.target.value);
  };

  const connectStore = async () => {
    if (!storeUrl) {
      return console.log("No store URL entered.");
    }

    setLoading(true); // Set loading to true before making request
    setError(null); // Reset previous errors

    const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
    const scopes = process.env.NEXT_PUBLIC_SHOPIFY_SCOPES; // Example: "read_products,write_orders"
    const state = Math.random().toString(36).substring(2); // Generate a random string for CSRF protection

    try {
      const data = {
        shop_url: storeUrl, // Store URL entered by user
        state: state, // Randomly generated state
      };

      // Create shop request
      const response = await fetch('https://eventsguy.clyrix.com/api/store-shop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      // Handle the response based on the status
      if (result.status === 'created') {
        console.log("Successfully created store!");
        
        // Redirect to Shopify OAuth page
        const authUrl = `https://${storeUrl}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;
        window.location.href = authUrl;
      } 
      else if (result.status === 'exists') {
        console.log("Shop already exists. Updating...");

        // If shop exists, send update request
        const updateData = {
          shop_url: storeUrl,
          state: state,
          status: "pending"
        };

        const updateResponse = await fetch(`https://eventsguy.clyrix.com/api/shop/${storeUrl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        const updateResult = await updateResponse.json();
        console.log("Update result: ", updateResult);
        // Redirect to Shopify OAuth page
        const authUrl = `https://${storeUrl}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;
        window.location.href = authUrl;
      } else {
        console.log("Unexpected status: ", result.status);
      }
    } catch (error) {
      console.error("Error during request:", error);
      setError('Failed to connect the store. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false after request
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
        {storeUrl && <p>Store URL: {storeUrl}</p>}
        
        <input
          type="text"
          placeholder="Enter Store URL"
          value={storeUrl}
          onChange={handleStoreUrlChange}
          className="border rounded-l px-4 py-2 w-64 focus:outline-none focus:ring focus:border-blue-300"
        />
        
        <button
          onClick={connectStore}
          disabled={loading} // Disable the button when loading
          className={`bg-blue-500 text-white rounded-r px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 ${loading && 'opacity-50 cursor-not-allowed'}`}
        >
          {loading ? 'Connecting...' : 'Connect'}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>} {/* Display error message */}
      </main>
    </div>
  );
}
