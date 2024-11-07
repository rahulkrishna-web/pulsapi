import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const shop = searchParams.get('shop');
  const code = searchParams.get('code');
  const hmac = searchParams.get('hmac');
  const host = searchParams.get('host');
  const state = searchParams.get('state');
  const timestamp = searchParams.get('timestamp');

  // Step 1: Validate the 'shop' parameter
  const shopRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/;
  if (!shop || !shopRegex.test(shop)) {
    return NextResponse.json({ error: 'Invalid shop parameter' }, { status: 400 });
  }

  // Step 2: Validate HMAC
  const secret = process.env.SHOPIFY_API_SECRET; // Ensure it's correct in your .env
  if (!secret) {
    return NextResponse.json({ error: 'Missing Shopify API Secret' }, { status: 500 });
  }

  const queryParams = { shop, code, host, state, timestamp };
  const message = Object.keys(queryParams)
    .sort()
    .map((key) => `${key}=${queryParams[key]}`)
    .join('&');

  const generatedHmac = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');

  if (generatedHmac !== hmac) {
    return NextResponse.json({ error: 'HMAC validation failed' }, { status: 400 });
  }

  const data = {
    client_id: process.env.SHOPIFY_API_KEY, // Use server-side environment variable
    client_secret: process.env.SHOPIFY_API_SECRET,
    code: code,  // The authorization code from Shopify
  };

  try {
    // Step 2: Make a POST request to Shopify's access token endpoint
    const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Check if the Shopify response is successful
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: 'Shopify token exchange failed', details: errorData.error }, { status: 500 });
    }

    const responseData = await response.json();
    const { access_token } = responseData;

    // Ensure that the access_token is present
    if (!access_token) {
      return NextResponse.json({ error: 'Access token missing from Shopify response' }, { status: 500 });
    }

    // Prepare data for your backend
    const shopData = {
      shop_url: shop,
      auth_token: access_token,
      status: 'installed',  // Mark shop as installed
    };

    // Step 3: Send the access token to your backend to store it
    const backendResponse = await fetch('https://eventsguy.clyrix.com/api/store-auth-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shopData),
    });

    // Check the response from the backend
    if (!backendResponse.ok) {
      const backendErrorData = await backendResponse.json();
      return NextResponse.json({ error: 'Failed to store the access token in the backend', details: backendErrorData.error }, { status: 500 });
    }

    const shopifyAdminUrl = `https://${shop}/admin/apps/pulsapi`;

    return NextResponse.redirect(shopifyAdminUrl);

  } catch (error) {
    console.error('Error in Shopify token exchange', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
