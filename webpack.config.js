const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.tsx', // Cambia al archivo correcto
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'], // Añade soporte para TypeScript
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/, // Para TypeScript
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/, // Para CSS
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html', // Apunta al archivo HTML en tu proyecto
        }),
    ],
    devServer: {
        static: './dist',
        open: true,
        hot: true,
    },
};
