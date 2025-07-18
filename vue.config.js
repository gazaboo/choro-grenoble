const { defineConfig } = require('@vue/cli-service')
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './src/styles/global.scss'),
      ]
    }
  },
  devServer: {
    allowedHosts: process.env.NETLIFY && process.env.NODE_ENV === 'development' ? 'all' : undefined
  }
})