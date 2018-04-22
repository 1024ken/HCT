const webpackConfig = require('./node_modules/@ionic/app-scripts/config/webpack.config');

webpackConfig.dev.resolve.alias = {
  querystring: 'querystring-browser'
};

webpackConfig.prod.resolve.alias = {
  querystring: 'querystring-browser'
};
