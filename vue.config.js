module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/remoteSimulatorPT/'
    : '/',
  "transpileDependencies": [
    "vuetify"
  ]
}