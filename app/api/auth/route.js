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

    const responseData = await response.json();

    if (responseData.error) {
      // Handle any errors from Shopify
      console.log('Shopify token exchange failed', responseData.error);
      return NextResponse.json({ error: 'Shopify token exchange failed', details: responseData.error }, { status: 500 });
    }

    // Assuming responseData contains access_token
    const { access_token } = responseData;

    // Optionally, save the access token to your backend here...

    // Return success response for testing
    return NextResponse.json({
      message: 'Shopify authentication successful!',
      shopifyParams: {
        shop,
        code,
        host,
        state,
        timestamp,
      },
      access_token, // Include the access token in the response
    });
  } catch (error) {
    console.error('Error in Shopify token exchange', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}