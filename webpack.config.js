/* eslint-env node */
const {join, resolve} = require('path');
const {DefinePlugin} = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const TerserPlugin = require('terser-webpack-plugin');
const source = 'node_modules/cesium/Source';
const workers = '../Build/Cesium/Workers';

module.exports = (env, argv) => ({
    mode: argv.mode === 'production' ? 'production' : 'development',
    entry: [
        ...(argv.mode === 'production' ? [] : ['react-hot-loader/patch']),
        './src/main.js'
    ],
    devtool: (argv.mode === 'production') ? void 0 : 'eval-source-map',
    output: {
        path: resolve('./dist'),
        filename: 'bundle.min.js'
    },
    devServer: {
        port: 4669,
        contentBase: './dist',
        compress: true,
        watchContentBase: true
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        '@babel/env'
                    ]
                }
            },
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.(png|gif|jpg|jpeg|svg|xml|json)$/,
                use: [
                    'url-loader'
                ]
            }
        ]
    },
    optimization: {
        minimize: argv.mode === 'production',
        minimizer: [new TerserPlugin()]
    },
    plugins: [
        new DashboardPlugin(),
        new DefinePlugin({CESIUM_BASE_URL: JSON.stringify('/')}),
        new CopyWebpackPlugin([
            {from: join(source, workers), to: 'Workers'},
            {from: join(source, 'Assets'), to: 'Assets'},
            {from: join(source, 'Widgets'), to: 'Widgets'}
        ])
    ],
    resolve: {
        modules: [resolve(__dirname, './src'), 'node_modules'],
        extensions: ['.js', '.jsx'],
        alias: {
            ...(argv.mode === 'production' ? {} : {'react-dom': '@hot-loader/react-dom'}),
            cesium$: 'cesium/Cesium',
            cesium: 'cesium/Source'
        }
    },
    amd: {
        toUrlUndefined: true
    },
    node: {
        fs: 'empty'
    }
});