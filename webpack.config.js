const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin'); // Copy .html content or the whole file
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // Remove old files
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Copy files from source to dist
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Move css in separated file
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin'); // Minify css files
const TerserWebpackPlugin = require('terser-webpack-plugin'); // Minify js files
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const HOST = isDev ? process.env.DEV_HOST : process.env.HOST;
const PORT = isDev ? process.env.DEV_PORT : process.env.PORT;
const IP = `${HOST}${PORT ? `:${PORT}` : ''}`;

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
};

const cssLoaders = (...extra) => {
  let cssLoader = [ // webpack comes through loader from right to the left
    // 'style-loader', // inject css into <style> in <head> in .html after script with css import has been loaded
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev, // update changes without reloading page
        reloadAll: true,
      },
    }, // move css in a separated file
    'css-loader', // allows webpack to understand css imports in js files
  ];

  if (extra) {
    cssLoader = [...cssLoader, ...extra];
  }

  return cssLoader;
};

const babelOptions = (...presets) => {
  const opts = {
    presets: [
      '@babel/preset-env',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ],
  };

  if (presets) {
    opts.presets = [...opts.presets, ...presets];
  }

  return opts;
};

const jsLoaders = () => {
  let loaders = [{
    loader: 'babel-loader',
    options: babelOptions(),
  }];

  if (isDev) {
    loaders = [
      ...loaders,
      {
        loader: 'eslint-loader',
        options: {
          eslintPath: path.resolve(__dirname, 'eslintrc.json'),
        },
      },
    ]; // add eslint-loader to check for warnings and errors
  }

  return loaders;
};

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({ // injects files into .html
      template: './index.html', // set source .html file
      IP,
      minify: {
        collapseWhitespace: isProd, // remove whitespace from .html file
      },
      inject: true,
      baseTag: isDev ? `<base href="http://${IP}" />` : '<base href="https://sv1nnet.github.io/e-commerce--react--typescript/" />',
    }),
    new CleanWebpackPlugin(), // clean dist from old files
    new CopyWebpackPlugin([ // Copy any files
      {
        from: path.resolve(__dirname, 'src/fav.ico'),
        to: path.resolve(__dirname, 'dist'),
      },
      {
        from: path.resolve(__dirname, 'src/assets/**/*.*'),
        to: path.resolve(__dirname, 'dist'),
      },
    ]),
    new MiniCssExtractPlugin({ // move css in separated file
      filename: filename('css'),
    }),
  ];

  if (isProd) {
    base.push(new BundleAnalyzerPlugin());
  }

  return base;
};

module.exports = {
  context: path.resolve(__dirname, 'src'), // Initial folder
  mode: 'development', // default build mode
  entry: { // files where webpack starts building
    main: ['../index.tsx'], // 'name of final file': 'paths to files'
  },
  output: {
    filename: filename('js'), // [name] - name of entry field; [contenthash] - file hash;
    path: path.resolve(__dirname, 'dist'), // build destination
  },
  resolve: {
    extensions: [ // what extensions webpack has to undertand by default in imports
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
      '.pmg',
    ],
    alias: { // path names for import; in import we can specify alias instead of relative path
      '@components': path.resolve(__dirname, 'src/components'),
      '@style': path.resolve(__dirname, 'src/style'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: optimization(), // allows to move multiple imports in a single separated file
  devServer: {
    host: HOST,
    port: PORT,
    open: true,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'src'),
    hot: isDev, // update changes without reloading page
  },
  devtool: isDev ? 'source-map' : '',
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/, // if file includes this pattern then webpack uses loaders on it
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: [
          'file-loader', // handle files (e.g. images or fonts)
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions('@babel/preset-typescript'),
          },
          'ts-loader',
        ],
      },
      // {
      //   test: /\.tsx$/,
      //   exclude: /node_modules/,
      //   use: ['babel-loader', 'ts-loader'],
      // },
      // {
      //   test: /\.jsx$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: babelOptions('@babel/preset-react'),
      //   },
      // },
    ],
  },
};
