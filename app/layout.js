'use client';
import { useSearchParams } from 'next/navigation';
import { AppProvider as PolarisProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';


import '@shopify/polaris/build/esm/styles.css';

export default function Layout({ children }) {
  const searchParams = useSearchParams();
  const shop = searchParams.get('shop');

  return (
    <html>
      <head>
        <title>Meta</title>
        {shop && (
          <>
          <meta name="shopify-api-key" content={process.env.SHOPIFY_API_KEY} />
          <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
          </>
        )}
      </head>
    <body>
    <PolarisProvider i18n={enTranslations}>
        {children}
    </PolarisProvider>
    </body>
    </html>
  );
}