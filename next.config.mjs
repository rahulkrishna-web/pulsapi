/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        SHOPIFY_API_KEY: "56e9da35b1f93e15cbc6b48e4ee7229c",
        SHOPIFY_API_SECRET: "a93b2788374bcd69ea042077ce9a3479",
        NEXT_PUBLIC_SHOPIFY_SCOPES: "read_products,write_products,read_orders,read_customers",
        NEXT_PUBLIC_REDIRECT_URI: "https://pulsapi.vercel.app/api/auth"
      },
};

export default nextConfig;
