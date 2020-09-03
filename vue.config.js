module.exports = {
  "pluginOptions": {
    "electronBuilder": {
      "nodeIntegration": true,
      "builderOptions": {
        "productName": "Shimmer - Moonlight Interface"
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