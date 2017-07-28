const _ = require("lodash");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const styleLoader = require.resolve("style-loader");
const cssLoader = require.resolve("css-loader");
const sassLoader = require.resolve("sass-loader");

module.exports = function(composer, options, compose) {
	const config = compose();

	// Remove the existing SCSS rule which for some reason is tied to the postCSS loader
	const rules = _.filter(
		config.module.rules,
		item => item.test && !_.includes(item.test.toString(), "scss")
	);

	// These options come right from the existing extract-file.js partial.
	// const cssLoaderOptions =
	//   '?modules&localIdentName=[name]__[local]___[hash:base64:5]&-autoprefixer';
	const cssLoaderOptions = "?modules&localIdentName=[local]&-autoprefixer";

	// This is based on Anooj's full file solution that he gave to Ghassan over gitter
	const sassQuery = cssLoader + cssLoaderOptions + "!" + sassLoader;

	// Put the new loader rule at the front
	rules.unshift({
		test: /\.scss$/,
		loader: ExtractTextPlugin.extract({
			fallback: styleLoader,
			use: sassQuery,
			publicPath: ""
		})
	});

	// Replace the old list of rules with this new list
	config.module.rules = rules;

	return config;
};
