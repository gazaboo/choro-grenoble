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
  }
})


module.exports = {
  devServer: {
    // Autorise tous les hosts uniquement en DEV sur Netlify
    allowedHosts: process.env.NETLIFY && process.env.NODE_ENV === 'development' ? 'all' : undefined
  }
}
