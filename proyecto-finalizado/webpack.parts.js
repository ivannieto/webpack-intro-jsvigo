const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');

exports.devServer = ({
    host,
    port
} = {}) => ({
    devServer: {
        historyApiFallback: true,
        stats: 'errors-only',
        contentBase: 'build',
        host,
        port,
        overlay: {
            errors: true,
            warnings: true,
        },
    },
});

exports.lintJavaScript = ({
    include,
    exclude,
    options
}) => ({
    module: {
        rules: [{
            test: /\.js$/,
            include,
            exclude,
            enforce: 'pre',
            use: [{
                loader: 'eslint-loader',
                options,
            }, ],
        }, ],
    },
});

exports.loadJavaScript = ({
    include,
    exclude
}) => ({
    module: {
        rules: [{
            test: /\.js$/,
            include,
            exclude,

            loader: 'babel-loader',
            options: {
                // Habilita cacheado para incrementar el rendimiento en desarrollo
                // A cacheDirectory se le puede pasar una ruta como parametro
                cacheDirectory: true,
            },
        }, ],
    },
});

exports.extractCSS = ({
    include,
    exclude,
    use
} = {}) => {
    const plugin = new ExtractTextPlugin({
        filename: '[name].css',
    });

    return {
        module: {
            rules: [{
                test: /\.css$/,
                include,
                exclude,

                use: plugin.extract({
                    use,
                    fallback: 'style-loader',
                }),
            }, ],
        },
        plugins: [plugin],
    };
};

exports.autoprefix = ({
    include,
    exclude
} = {}) => ({
    loader: 'postcss-loader',
    options: {
        plugins: () => ([
            require('autoprefixer'),
        ]),
    },
});

exports.loadCSS = ({
    include,
    exclude,
    options
} = {}) => ({
    module: {
        rules: [{
            test: /\.css$/,
            include,
            exclude,
            use: [{
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader',
                    options,
                },
            ],
        }, ],
    },
});


exports.purifyCSS = ({
    paths
}) => ({
    plugins: [
        new PurifyCSSPlugin({
            paths
        }),
    ],
});

exports.lintCSS = ({
    include,
    exclude
}) => ({
    module: {
        rules: [{
            test: /\.css$/,
            include,
            exclude,
            enforce: 'pre',
            loader: 'postcss-loader',
            options: {
                plugins: () => ([
                    require('stylelint')({
                        // Ignora los CSS de node_modules
                        ignoreFiles: 'node_modules/**/*.css',
                    }),
                ]),
            },
        }, ],
    },
});

exports.loadImages = ({
    include,
    exclude,
    options
} = {}) => ({
    module: {
        rules: [{
            test: /\.(png|jpg|svg)$/,
            include,
            exclude,

            use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 15000,
                        name: 'assets/images/[name].[ext]',
                    },

                },
                {
                    loader: 'image-webpack-loader',
                    options: {
                        query: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65

                            },
                            gifsicle: {
                                interlaced: true,
                            },
                            optipng: {
                                optimizationLevel: 7,
                            },
                            pngquant: {
                                quality: "65-90",
                                speed: 4
                            }
                        }
                    },
                }
            ]
        }, ],
    },
});

exports.loadFonts = ({
    include,
    exclude,
    options
} = {}) => ({
    module: {
        rules: [{
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff",
                options,
            },
            {
                test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader",
                options,
            }
        ],
    },
});


exports.generateSourceMaps = ({
    type
}) => ({
    devtool: type,
});


exports.clean = (path) => ({
    plugins: [
        new CleanWebpackPlugin([path]),
    ],
});


exports.minifyJS = () => ({
    plugins: [
        new BabiliPlugin(),
    ],
});

exports.minifyCSS = ({
    options
}) => ({
    plugins: [
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.min\.css$/,
            cssProcessor: cssnano,
            cssProcessorOptions: options,
            canPrint: false,
        }),
    ],
});
