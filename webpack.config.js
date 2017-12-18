const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PRODUCTION = process.env.NODE_ENV ==='production';
const DEVELOPMENT = process.env.NODE_ENV ==='development';

/* This is the postCss loader which gets fed into the next loader.*/
const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins(){return [autoprefixer({browsers: 'last 3 versions'})];  },
  }
};

const extractCSSDependencies = new ExtractTextPlugin('dependencies-[contenthash:10].min.css');
const extractSASS = new ExtractTextPlugin('app-[contenthash:10].min.css');

const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
const cssProd = extractSASS.extract(['css-loader?sourceMap&minimize=true', postcss, 'sass-loader']);

const cssConfig = PRODUCTION ? cssProd : cssDev;

/* This is the images configuration */

const imgDev = ['file-loader?name=[name].[ext]'];
const imgProd = ['url-loader?limit=10000&name=images/[name]-[hash:6].[ext]','image-webpack-loader'];

const imgConfig = PRODUCTION ? imgProd : imgDev;

/*paths that should be cleaned by the clean webpack plugin*/
let pathsToClean = [
  'htdocs'
]

/* the clean options to use */
let cleanOptions = {
  exclude:  ['assets', 'api']
}

/* This is the plugins configuration */
const pluginsDev = [
    new HtmlWebpackPlugin({
      title: 'Project Setup',
      template: './source/views/index.pug',
      alwaysWriteToDisk: true,
      inject: 'body'
    }),
    new HtmlWebpackHarddiskPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ];

const pluginsProd = [
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      comments: false,
      compress: {
        warnings: true
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Project Setup',
      template: './source/views/index.pug',
      inject: 'head'
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de|en/)
  ];

const pluginsConfig = PRODUCTION ? pluginsProd : pluginsDev;

pluginsConfig.push(
  new webpack.DefinePlugin({
    DEVELOPMENT: JSON.stringify(DEVELOPMENT),
    PRODUCTION: JSON.stringify(PRODUCTION)
  }),
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor', 'manifest']
  }),
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  }),
  extractCSSDependencies,
  extractSASS
);

/* Ok, now we put it all together */
const config = {
  devtool: 'source-map',
  entry: {
    app: ['babel-polyfill', './source/scripts/app.js']
  },
  output: {
    path: path.resolve(__dirname, 'htdocs'),
    filename: PRODUCTION ? '[name].bundle.[chunkhash:10].min.js' : '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
        {loader: 'html-loader'},
        {loader: 'pug-html-loader'}
        ]
      },
      {
        test: /\.html$/,
        use: ['raw-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: imgConfig
      },
      {
        test: /\.ico$/,
        use: ['file-loader?name=[name].[ext]','image-webpack-loader']
      },
      {
        test: /\.sass$/,
        use: cssConfig
      },
      {
        test: /\.css$/,
        use: extractCSSDependencies.extract(['css-loader?minimize=true'])
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'htdocs'),
    compress: true,
    stats: 'errors-only',
    open: true,
    hot: true,
    clientLogLevel: "none"
    // host: '10.110.2.114',
    // port: 8080
  },
  plugins: pluginsConfig
}

module.exports = config;