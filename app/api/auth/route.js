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
  const secret = process.env.API_SECRET;
  if (!secret) {
    throw new Error('Missing Shopify API Secret');
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
    client_id: NEXT_PUBLIC_SHOPIFY_API_KEY,
    client_secret: API_SECRET,
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

    console.log("response data", responseData);

    if (responseData.error) {
      // Handle any errors from Shopify
      console.log('Shopify token exchange failed', responseData.error);
    }
    /*
    const { access_token } = responseData;  // Extract access token from response

    // Step 3: Send the access token to your Laravel backend to store it
    const shopData = {
      shop_url: shop,
      auth_token: access_token,
      status: 'installed',  // Mark shop as installed
    };

    const backendResponse = await fetch('https://eventsguy.clyrix.com/api/store-auth-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shopData),
    });

    const backendResult = await backendResponse.json();

    if (backendResult.error) {
      return res.status(500).json({ error: 'Failed to store the access token in the backend', details: backendResult.error });
    }

    // Success
    return res.status(200).json({
      message: 'Shop installed and token saved successfully!',
      shop: backendResult.shop,
    });
    */
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }

  // Step 3: Return success response for testing
  return NextResponse.json({
    message: 'Shopify authentication successful!',
    shopifyParams: {
      shop,
      code,
      host,
      state,
      timestamp,
    },
  });
}
