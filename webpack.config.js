const Uglify = require("uglifyjs-webpack-plugin");

module.exports = {
    entry: {
        background: "./src/background.js",
        options: "./src/options.js"
    },

    output: {
        filename: "[name].min.js",
        path: __dirname + "/dist"
    },

    module: {
        loaders: [
            { test: /\.js$/, loader: "babel-loader" }
        ]
    },

    plugins: [
        new Uglify()
    ]
};