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
