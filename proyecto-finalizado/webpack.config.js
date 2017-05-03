const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv').config();
const merge = require('webpack-merge');
const glob = require('glob');
const webpack = require('webpack');

const parts = require('./webpack.parts');

// Rutas globales
const PATHS = {
    // Toma el directorio app/ como entrada
    app: path.join(__dirname, 'src'),
    // Proporciona el directorio build/ como salida
    build: path.join(__dirname, 'build'),
}

// Configuración común
const commonConfig = merge([{
        entry: {
            app: PATHS.app,
            vendor: ['react', 'font-awesome-webpack'],
        },
        output: {
            path: PATHS.build,
            filename: '[name].js',
        },
        // Llamada a plugins que realicen procesos sobre nuestros archivos,
        // estos pueden tomar parámetros como opciones
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Introducción a Webpack2',
                template: './src/index.html',
            }),
            new webpack.optimize.CommonsChunkPlugin({
                names: ['assets/vendor/react', 'assets/vendor/font-awesome'],
            }),
        ],
        stats: {
            chunks: false,
        },
        node: {
            fs: "empty"
        },
    },
    parts.lintJavaScript({
        include: PATHS.app,
        exclude: '/node_modules/'
    }),
    parts.lintCSS({
        include: PATHS.app
    }),
    parts.loadFonts({
        options: {
            name: 'assets/fonts/[name].[ext]'
        }
    }),
    parts.loadJavaScript({
        include: PATHS.app
    }),
]);

// Configuración de producción
const prodConfig = merge([
    parts.extractCSS({
        use: ['css-loader', parts.autoprefix()],
    }),
    parts.purifyCSS({
        paths: glob.sync(`${PATHS.app}/**/*.js`, {
            nodir: true
        }),
    }),
    // Exporta las imágenes filtrando por tamaño > 15Kb
    // a la ruta definida en name
    parts.loadImages({
        options: {
            limit: 15000,
            name: 'assets/images/[name].[ext]',
        },
    }),
    parts.generateSourceMaps({
        type: 'source-map'
    }),
    parts.clean(PATHS.build),
    parts.minifyJS({ useSourceMap: true }),
    parts.minifyCSS({
        options: {
            discardComments: {
                removeAll: true,
            },
            safe: true,
        },
    }),
]);

// Configuración de desarrollo
const devConfig = merge([
    parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT,
    }),
    parts.extractCSS({
        use: ['css-loader', parts.autoprefix()],
    }),
    // Carga las imágenes siempre en modo base64
    parts.loadImages(),
    {
        output: {
            devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
        },
    },
    parts.generateSourceMaps({
        type: 'cheap-module-source-map'
    }),
]);

// Configuración de entorno
module.exports = (env) => {
    if (env == 'production') {
        return merge(commonConfig, prodConfig);
    }
    return merge(commonConfig, devConfig);
};
