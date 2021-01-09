module.exports = {
  http: 8080,
  plugins: {
    add: [
      '@gasket/jest',
      '@gasket/plugin-express',
      '@gasket/plugin-https',
      '@gasket/plugin-log',
      '@gasket/plugin-nextjs',
      '@gasket/plugin-webpack'
    ],
  },
  nextConfig: {
    distDir: 'build'
  }
};
