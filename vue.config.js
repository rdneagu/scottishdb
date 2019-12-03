module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '^/api/': {
        target: 'http://localhost:8585',
        changeOrigin: true,
      }
    }
  }
}