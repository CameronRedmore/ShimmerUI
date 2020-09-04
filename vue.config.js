module.exports = {
  "pluginOptions": {
    "electronBuilder": {
      "nodeIntegration": true,
      "builderOptions": {
        "productName": "Shimmer"
      }
    }
  },
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    devtool: 'source-map'
  }
}