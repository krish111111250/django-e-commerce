const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://django-e-commerce-production-f7fc.up.railway.app',
      changeOrigin: true,
    })
  );
};