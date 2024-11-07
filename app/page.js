'use client'

import React, { useState } from 'react';
import Image from "next/image";

export default function Home() {
  const [storeUrl, setStoreUrl] = useState('');

  const handleStoreUrlChange = (e) => {
    setStoreUrl(e.target.value);
  };

  const connectStore = () => {
    if (!storeUrl){
      return console.log("no store url");
    }

    const apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
    const scopes = process.env.NEXT_PUBLIC_SHOPIFY_SCOPES; // Example: "read_products,write_orders"
    const state = Math.random().toString(36).substring(2); // Generate a random string for CSRF protection

    // Construct the authorization URL
    const authUrl = `https://${storeUrl}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;

    // Redirect the user to the Shopify authorization screen
    window.location.href = authUrl;
  }

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
        { storeUrl }
        <input
        type="text"
        placeholder="Store URL"
        value={storeUrl}
        onChange={handleStoreUrlChange}
        className="border rounded-l px-4 py-2 w-64 focus:outline-none focus:ring focus:border-blue-300"
      />
      <button
        onClick={connectStore}
        className="bg-blue-500 text-white rounded-r px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
      >
        Connect
      </button>
      </main>
    </div>
  );
}
