'use client';
import Script from 'next/script'
import { AppProvider as PolarisProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';

import '@shopify/polaris/build/esm/styles.css';

export default function Layout({ children }) {
  return (
    <html>
      <head>
        <meta name="shopify-api-key" content={process.env.SHOPIFY_API_KEY} />
        <Script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></Script>
      </head>
      <body>
        <PolarisProvider i18n={enTranslations}>
          {children}
        </PolarisProvider>
      </body>
    </html>
  );
}