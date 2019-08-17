const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/js/index.js',
    plugins: [
        new CleanWebpackPlugin(),
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery',
        //     THREE: "three"
        // }),
        new HtmlWebpackPlugin({
            title: 'Christmas 2015',
            meta: {
                "viewport": 'width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0',
                "property": { "property":"og:image", "content":"ogimage.jpg" }
            },
            // favicon: "src/images/favicon.ico"
            // template: 'src/test.html'
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    // resolve: {
    //     alias: {
    //       Classes: path.resolve(__dirname, 'src/js/classes/'),
    //     }
    // },
    module: {
        rules: [
            {
                test: require.resolve("./src/js/libs/threex.skydomeshader.js"),
                use: ['imports-loader?THREE=three', 'exports-loader?THREEx']
            },
            {
                // shim because SPE 1.0.6 is not a module
                // delete SPEs dependency on threejs in package-lock.json 
                // or it will fallback and doesnt work!
                test: require.resolve("shader-particle-engine"),
                use: ['imports-loader?THREE=three', 'exports-loader?SPE']

            },
		// {
		// 	test: /\.(obj|mtl)$/,
		// 	use: { loader: 'file-loader', options: { outputPath: 'objs' } }
        // },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                { 
                    loader: 'file-loader',
                    options: { outputPath: 'img' } // where to place images referenced in CSS and modules
                }
            ]
        },
        ]
    }
};