const path = require('path');
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
    optimization: {
        splitChunks: { name: 'vendor', chunks: 'all' }
    },
    // resolve: {
    //     alias: {
    //       Classes: path.resolve(__dirname, 'src/js/classes/'),
    //     }
    // },
    module: {
        rules: [
            // Shim THREEx.skydomeshader
            {
                test: require.resolve("./src/js/libs/threex.skydomeshader.js"),
                use: [
                    'imports-loader?imports=namespace|three|THREE',
                    'exports-loader?exports=THREEx'
                ]
            },
            // Shim SPE-Package
            {
                test: require.resolve("shader-particle-engine"),
                use: [
                    'imports-loader?imports=namespace|three|THREE',
                    'exports-loader?exports=default|SPE'
                ]
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