const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/chat',
          permanent: true,
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  