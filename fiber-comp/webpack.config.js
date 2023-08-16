// const fs = require('fs')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');
const process = require('process')

// const _bake_names = require('./_bake-names')

// const deployPath = '../../var/web'
const deployPath = 'dist'
const webSubPath = 'fiber-comp-example'

const config0 = () => ({
    // https://webpack.js.org/concepts/mode/
    mode: 'development',
    // mode: 'production',
    devtool: 'inline-source-map',
    //
    entry: `./src/crossyo/${webSubPath}/demo1.js`,
    output: {
        path: path.resolve(__dirname, `${deployPath}/${webSubPath}`),
        publicPath: `/${webSubPath}/`,
        // filename: '[name].[chunkhash].js',
        filename: '[chunkhash].js',
        clean: {
            keep: /thumbnail|asset/,
        },
    },
    module: {
        rules: [ //
            // {
            //   test: /\.(js|jsx)$/,
            //   exclude: /node_modules/,
            //   use: {
            //     loader: 'babel-loader',
            //   }
            // },

            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },

            //
            //   {
            //     test: /\.scss$/,
            //     use: [
            //       'style-loader',
            //       'css-loader',
            //       'sass-loader'
            //     ]
            //   }, //

            {
                test: /\.(png|jpg|woff|woff2)$/,
                type: 'asset/inline', // url-loader
            },
            {
                test: /\.(txt|csv|geojson|svg|glsl|obj|htm)$/,
                loader: 'raw-loader',
                // type: 'asset/source', // glsl有问题
            },
            {
                test: /\.(glb|exr|webp|m4v)$/,
                type: 'asset/resource', // file-loader
            },


        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'demo1.html',
            template: `src/crossyo/${webSubPath}/template/demo1.html`,
        }),

        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, `public`),
                    to: path.resolve(__dirname, `${deployPath}/${webSubPath}`),
                    // filter: async (path) => {
                    //     // console.log(path)
                    //     return /\.(exr|png|jpg|glb)$/.test(path)
                    // },
                    noErrorOnMissing: true,
                },
            ]
        })
    ],
    // https://webpack.js.org/configuration/dev-server/
    devServer: {
        allowedHosts: 'all',
        compress: true,
        // compress: false,

        // host: '0.0.0.0',
        host: 'local-ip',
        port: 4160,
        static: [{
            directory: path.join(__dirname, `${deployPath}/${webSubPath}`),
            serveIndex: true,
            publicPath: `/${webSubPath}/`,
            // watch: true,
            // }, {
            //     directory: path.resolve(`D:/svn/crossyo2/working/asset/env`),
            //     serveIndex: true,
            //     publicPath: `/static/env`,
        }],
        open: {
            target: [
                `${webSubPath}/demo1.html`
            ],
            app: {
                name: (() => {
                    if (process.platform == 'darwin') {
                        return 'Google Chrome'
                        // } else if () { // linux is google-chrome
                    } else {
                        return 'chrome'
                    }
                })(),
                // arguments: ['--xxx']
            }
        },
        //    proxy: [{
        //        context: ['/api'],
        //        target: 'http://wxhrsoft.6655.la:8088'
        //    }]
    },

})

module.exports = env => {
    const config1 = config0()
    if (env) {

        if (env.prod) {
            config1.mode = 'production'
            delete config1.devtool
        }

    }

    return config1
};
