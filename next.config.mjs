import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import withTM from 'next-transpile-modules';

const withTranspile = withTM(['@uniswap/smart-order-router']);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['coin-images.coingecko.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
        https: require.resolve('https-browserify'),
        http: require.resolve('stream-http'),
      };
    }
    return config;
  },
};

export default withTranspile(nextConfig);