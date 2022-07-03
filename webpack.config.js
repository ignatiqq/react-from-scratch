const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

console.log(path.join(__dirname, "/"))

module.exports = {
    mode: "development",
    entry: {
        main: "./src/index.jsx"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[contenthash].js",
        clean: true
    },
    devServer: {
        historyApiFallback: true,
        port: 8081,
        open: true
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.m?jsx$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react']
                    }
                }
            }
        ],
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.join(__dirname, "/src/index.html")
        })
    ]
}