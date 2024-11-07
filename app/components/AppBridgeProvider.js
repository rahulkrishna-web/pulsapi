// components/AppBridgeProvider.js
import { useMemo } from 'react';
import { AppBridgeProvider as Provider } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';

const AppBridgeProvider = ({ children }) => {
  const apiKey = process.env.SHOPIFY_API_KEY;
  const host = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('host') : '';

  const appBridgeConfig = useMemo(() => {
    return {
      apiKey,
      host,
      forceRedirect: true, // Ensures redirection happens within the Shopify Admin context
    };
  }, [apiKey, host]);

  return (
    <Provider config={appBridgeConfig}>
      {children}
    </Provider>
  );
};

export default AppBridgeProvider;
