module.exports = {
  publicPath: '/webtech/',
  devServer: {
    proxy: {
      '^/api/': {
        target: 'http://localhost:8585',
        changeOrigin: true,
      }
    }
  }
}