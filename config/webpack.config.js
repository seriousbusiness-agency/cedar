import AfterBuildPlugin from '@fiverr/afterbuild-webpack-plugin'
import BrowserSyncPlugin from 'browser-sync-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import dotenvParseVariables from 'dotenv-parse-variables'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import JsonMinimizerPlugin from 'json-minimizer-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import Mustache from 'mustache'
import * as portFinderSync from 'portfinder-sync'
import openBrowser from 'react-dev-utils/openBrowser.js'
import TerserPlugin from 'terser-webpack-plugin'
import webpack from 'webpack'
import WebpackBuildNotifierPlugin from 'webpack-build-notifier'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { WebpackManifestPlugin, getCompilerHooks } from 'webpack-manifest-plugin'
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts'
import WebpackBar from 'webpackbar'

import chalk from 'chalk'
import figlet from 'figlet'
import fs from 'fs'
import { glob } from 'glob'
import inquirer from 'inquirer'
import { resolve } from 'path'
import shell from 'shelljs'
import jsconfig from '../jsconfig.json' with { type: 'json' }
import pkg from '../package.json' with { type: 'json' }

if (!fs.existsSync('./.prepare/config.json')) {
	console.log(chalk.yellow(`Your project is not ready.\nTo prepare your project run the 'yarn prepare' command.`))
	shell.exec(`killall node`)
	process.exit(0)
}

dotenvExpand.expand(dotenvParseVariables(dotenv.config().parsed))

const ENV = dotenvParseVariables(process.env)
const MODE = ENV.NODE_ENV || 'development'
const PRODUCTION_MODE = MODE === 'production'
const PREPARE_DIR = `.prepare`
const MYCONFIG_JSON_PATH = `${PREPARE_DIR}/myconfig.json`
const { default: MY_PREPARE_CONFIG } = fs.existsSync(MYCONFIG_JSON_PATH)
	? await import(`../${MYCONFIG_JSON_PATH}`, { assert: { type: 'json' } })
	: { default: { MY_PREPARE_CONFIG: null } }

// if change 'DIST_DIR' .env variable
if (process.env.CI !== 'true') {
	if (MY_PREPARE_CONFIG.DIST_DIR !== ENV.DIST_DIR) {
		console.log(chalk.bgRed(figlet.textSync('DANGER!', { horizontalLayout: 'full' })))
		const answer = await inquirer.prompt({
			name: 'confirm',
			type: 'list',
			message: `Are you sure this is the dist directory ${chalk.underline.yellow(resolve(ENV.DIST_DIR))}?\n${chalk.red('All files in this directory will be deleted.')}`,
			choices: [
				{
					name: 'No',
					value: 0
				},
				{
					name: 'Yes',
					value: 1
				}
			],
			default: 0
		})

		if (answer.confirm) {
			fs.writeFileSync(MYCONFIG_JSON_PATH, JSON.stringify({ ...MY_PREPARE_CONFIG, DIST_DIR: ENV.DIST_DIR }), 'utf8')
		} else {
			console.log(chalk.blueBright(`Change your 'DIST_DIR' variable in your .env file`))
			shell.exec(`killall node`)
			process.exit(0)
		}
	}
}
// end check

const { DEBUG, STRIP, EXTRACT, ANALYZE, DEV_HOST, MAP_HOST, PROXY, PROD_HOST, OPEN_BROWSER, BROWSER_SYNC } = ENV
let { PORT } = ENV
PORT = !PORT || PORT === 'auto' ? portFinderSync.getPort(3000) : PORT

ENV.production = PRODUCTION_MODE
ENV.development = !PRODUCTION_MODE
ENV.debug = Boolean(DEBUG)
ENV.extract = Boolean(EXTRACT)
pkg.baseUrl = PRODUCTION_MODE ? PROD_HOST : `${DEV_HOST}` // `${DEV_HOST}:${PORT}/`;
pkg.baseUrl = pkg.baseUrl.includes('http') ? pkg.baseUrl : `http://${pkg.baseUrl}`

const DIR = resolve('./').replaceAll('\\', '/')
const CONFIG_DIR = `${DIR}/config`
const SRC_DIR = `${DIR}/src`
const SRC_PUBLIC_DIR = `${SRC_DIR}/public`
const JS_DIR = `${SRC_DIR}/js`
// const SCSS_DIR = `${SRC_DIR}/scss`;
const BUILD_DIR = `${DIR}/build`
const DIST_DIR = ENV.DIST_DIR ? `${resolve(ENV.DIST_DIR).replaceAll('\\', '/')}` : `${BUILD_DIR}/dist`

ENV.SRC_PUBLIC_DIR = SRC_PUBLIC_DIR

const HASH_ZISE = 5
const FILENAME = PRODUCTION_MODE ? `[name].[contenthash:${HASH_ZISE}]` : '[name]'
const resolvePaths = (arr) => arr.map((path) => `${SRC_DIR}/${path}`)
const FILES_WITHOUT_HASH = resolvePaths([
	`**/*.txt`,
	`**/*.yml`,
	`**/*.html`,
	`**/*.php`,
	`**/*.toml`,
	`**/*.md`,
	`**/content/**/*`,
	`**/*.htaccess`,
	`**/sitemap_index.xml`,
	`**/sitemap.xml`,
	`**/robots.txt`,
	`**/jsmanifest.json`,
	`**/pwamanifest.json`,
	`**/site.webmanifest`,
	...pkg.files_without_hash
])
const FILES_WITH_MUSTACHE = resolvePaths([])
const MAX_FILE_SIZE = 2048000

const ENTRIES = {
	preloader: [`${JS_DIR}/preloader.js`],
	main: [`${JS_DIR}/main.js`]
}
const CSS_RENAME_MAP = {
	// main: 'nonessential'
	preloader: 'essential',
	main: 'main'
}
const ENVIRONMENT_VARIABLES = {
	ENV: { ...ENV, DEV_MODE: !PRODUCTION_MODE },
	DATA: pkg
}
const TRANSFORM_RULES = {
	transformer: (content, path) =>
		FILES_WITH_MUSTACHE.includes(path.replaceAll('\\', '/'))
			? Mustache.render(content.toString(), ENVIRONMENT_VARIABLES)
			: content
}
const HTML_SOURCE_FILES = [
	{
		templates: glob.sync(`${SRC_PUBLIC_DIR}/**/*.{html,php,md}`, {
			ignore: [
				// `${SRC_PUBLIC_DIR}/site/accounts/**/*`,
			]
		}),
		chunks: ['preloader'],
		// templateParameters: data,
		inject: false
	}
]

const TEMPLATES = []
HTML_SOURCE_FILES.forEach((obj) => {
	obj.templates.forEach((template) => {
		const props = { ...obj }
		delete props.templates
		props.template = template.replaceAll('\\', '/')
		props.filename = props.template.slice(props.template.indexOf('src/public') + 'src/public'.length + 1)
		props.minify = PRODUCTION_MODE
			? {
					collapseWhitespace: false,
					collapseInlineTagWhitespace: false, // Changed to false
					keepClosingSlash: true, // Changed to true
					removeComments: false, // Changed to false
					minifyJS: true,
					minifyCSS: true,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributes: true,
					includeAutoGeneratedTags: false,
					ignoreCustomFragments: [/{{[\s\S]*?}}/] // Added to preserve Hugo templates
				}
			: false
		TEMPLATES.push(props)
	})
})

const COPY_FILES = [
	{
		context: SRC_PUBLIC_DIR,
		from: '**/*',
		to: `${DIST_DIR}/[path]${FILENAME}[ext]`,
		noErrorOnMissing: true,
		globOptions: {
			dot: false,
			ignore: [
				...FILES_WITHOUT_HASH,
				`${SRC_PUBLIC_DIR}/img`,
				`${SRC_PUBLIC_DIR}/font`,
				`${SRC_PUBLIC_DIR}/manifest.json`,
				// Add Hugo template files to ignore
				`${SRC_PUBLIC_DIR}/layouts/**/*.html`,
				`${SRC_PUBLIC_DIR}/layouts/**/*.php`
			]
		}
	},
	{
		context: SRC_PUBLIC_DIR,
		from: 'img/**/*',
		to: `${DIST_DIR}/img/[name][ext]`,
		noErrorOnMissing: true,
		globOptions: {
			dot: false
		}
	},
	// ...(
	//    ['img', 'video', 'js'].map(path => {
	//       return {
	//          context: SRC_PUBLIC_DIR,
	//          from: `${path}/**/*`,
	//          to: `${DIST_DIR}/${path}/[name][ext]`,
	//          noErrorOnMissing: true,
	//          globOptions: {
	//             dot: false
	//          }
	//       }
	//    })
	// ),
	...FILES_WITHOUT_HASH.map((path) => {
		return {
			context: SRC_PUBLIC_DIR,
			from: path,
			to: `${DIST_DIR}/[path][name][ext]`,
			noErrorOnMissing: true,
			globOptions: {
				dot: true,
				ignore: TEMPLATES.map((template) => template.template)
			},
			transform: TRANSFORM_RULES
		}
	})
	// {
	// 	context: `${DIR}/node_modules`,
	// 	from: "three/examples/jsm/libs/draco",
	// 	to: `${DIST_DIR}/js/draco`,
	// 	noErrorOnMissing: true,
	// 	globOptions: {
	// 		dot: false
	// 	}
	// },
	// {
	//     context: SRC_PUBLIC_DIR,
	//     from: "**/*.json",
	//     to: `${DIST_DIR}/[path]${FILENAME}[ext]`,
	// }
]

const ALIAS = {}
Object.entries(jsconfig.compilerOptions.paths).forEach(
	([key, value]) => (ALIAS[`${key.slice(0, -2)}`] = value.map((_value) => `${SRC_DIR}/${_value.slice(0, -2)}`))
)

class ManifestFixPlugin {
	apply(compiler) {
		const { beforeEmit } = getCompilerHooks(compiler)
		beforeEmit.tap('ManifestFixPlugin', (manifest) => {
			const newManifest = {}
			for (const key in manifest) {
				let value = manifest[key]
				// console.log(key, value);
				value = value.startsWith('./') ? value.slice(2) : value
				const hashLastIndex = value.lastIndexOf('/')
				// const keyLastIndex = key.lastIndexOf('/') + 1;
				const hashedFile = value.slice(hashLastIndex + 1)
				const splitedFile = hashedFile.split('.')
				const splitedLength = splitedFile.length
				const hash = PRODUCTION_MODE ? (splitedLength > 2 ? splitedFile.splice(-2, 1)[0] : '') : ''
				if (splitedLength < 3 || hash.length != HASH_ZISE) continue
				const originalFile = PRODUCTION_MODE ? splitedFile.join('.') : hashedFile // key.substring(keyLastIndex);
				const paths = value.substring(0, hashLastIndex).split('/')
				let obj = newManifest
				paths.forEach((path) => {
					if (!path) return
					if (!obj[path]) obj[path] = {}
					obj = obj[path]
				})
				obj[originalFile] = hash
				// newManifest[originalFile] = hashedFile;
			}
			return { ...newManifest }
		})
	}
}
export default {
	target: PRODUCTION_MODE ? ['web', 'es5'] : 'web',
	mode: MODE,
	devtool: false,
	stats: {
		preset: 'minimal',
		chunks: false,
		modules: false,
		warnings: ENV.SHOW_WARNINGS,
		warningsCount: ENV.SHOW_WARNINGS
	},
	entry: ENTRIES,
	output: {
		path: DIST_DIR,
		filename: `js/${FILENAME}.js`,
		clean: !PRODUCTION_MODE
	},
	resolve: {
		alias: ALIAS,
		extensions: ['.js', '.jsx', '.scss', '...']
	},
	plugins: [
		// new CleanTerminalPlugin(),
		new webpack.DefinePlugin({
			ENV: JSON.stringify(ENVIRONMENT_VARIABLES.ENV),
			DATA: Object.entries(ENVIRONMENT_VARIABLES.DATA).reduce(
				(acc, curr) => ({ ...acc, [`${curr[0]}`]: JSON.stringify(curr[1]) }),
				{}
			)
		}),
		new WebpackBar({ name: pkg.name }),
		...(PRODUCTION_MODE
			? [
					new BundleAnalyzerPlugin({
						analyzerMode: ANALYZE || 'disabled',
						Analyzerport: PORT,
						openAnalyzer: false,
						generateStatsFile: true,
						statsFilename: `${BUILD_DIR}/stats.json`
					}),
					new JsonMinimizerPlugin({ test: /\.(json|gltf|obj)$/ })
				]
			: [
					...(BROWSER_SYNC
						? [
								new BrowserSyncPlugin(
									{
										host: DEV_HOST,
										port: PORT,
										proxy: PROXY,
										open: false,
										notify: false,
										files: [
											{
												match: [
													`${DIST_DIR}/**/*.{css,js}`, // Watch for CSS and JS changes
													`${SRC_PUBLIC_DIR}/**/*.{html,php}` // Watch for template changes
												],
												fn(event, file) {
													if (file.endsWith('.css')) {
														this.reload('*.css')
													} else {
														this.reload()
													}
												}
											}
										]
									},
									{
										reload: false,
										injectCss: true
									}
								)
							]
						: [])
				]),
		...(PRODUCTION_MODE || EXTRACT
			? [
					new MiniCssExtractPlugin({
						filename: ({ chunk }) => {
							return `css/${FILENAME.replace('[name]', CSS_RENAME_MAP[chunk.name])}.css`
						},
						experimentalUseImportModule: true
					})
				]
			: []),
		...TEMPLATES.map((template) => new HtmlWebpackPlugin(template)),
		new CleanWebpackPlugin({
			dry: false,
			cleanOnceBeforeBuildPatterns: [`${DIST_DIR}/**/*`, `${BUILD_DIR}/sourcemaps`],
			dangerouslyAllowCleanPatternsOutsideProject: true
		}),
		new WebpackManifestPlugin({
			basePath: '',
			publicPath: './',
			filter: (file) =>
				!file.path.match(/(\.(map|php|html|htaccess|ttf|woff|woff2)$)/) &&
				!['./sitemap.xml', './js/runtime.js', './jsmanifest.json'].includes(file.path)
		}),
		new ManifestFixPlugin(),
		new CopyWebpackPlugin({
			patterns: COPY_FILES
		}),
		new RemoveEmptyScriptsPlugin({ enabled: PRODUCTION_MODE }),
		new webpack.ProgressPlugin(),
		new webpack.SourceMapDevToolPlugin({
			...(PRODUCTION_MODE
				? {
						filename: `./sourcemaps/[file].map`,
						append: `\n//# sourceMappingURL=${MAP_HOST}/[file].map`
					}
				: {})
		}),
		// new webpack.HotModuleReplacementPlugin(),
		new webpack.BannerPlugin({
			banner: `name: ${pkg.name}\nversion: v${pkg.version}\ndescription: ${pkg.description}\nauthor: ${pkg.author}\nhomepage: ${pkg.homepage}\n(c): ${new Date().getFullYear()}`
		}),
		...(ENV.BUILD_NOTIFICATIONS
			? [
					(global.notify = new WebpackBuildNotifierPlugin({
						title: pkg.name,
						activateTerminalOnError: true,
						showDuration: true,
						sound: ENV.BUILD_NOTIFICATIONS_SOUND,
						formatSuccess: () => {
							global.notify.logo = `${CONFIG_DIR}/icon/success.png`
							return '✅ Build successful!'
						},
						messageFormatter: (data, filepath, status, count) => {
							let message = ''

							switch (status) {
								case 'error': {
									message = `❌ ${data.error}`
									global.notify.logo = `${CONFIG_DIR}/icon/failure.png`
									break
								}
								case 'warning':
									if (ENV.SHOW_WARNINGS) {
										message = `⚠️ ${data.name}`
										global.notify.logo = `${CONFIG_DIR}/icon/warning.png`
										const { assets } = data
										if (assets && assets.length) message += `: ${assets[0].name}`
									} else return global.notify.formatSuccess()
									break
								default:
							}

							return message
						}
					}))
				]
			: []),
		new AfterBuildPlugin(() => {
			// if (!PRODUCTION_MODE) {
			// 	// Kill any existing Hugo server process
			// 	shell.exec(`cd ${DIST_DIR} && pkill hugo`, { silent: true })

			// 	// Start a new Hugo server in the build directory
			// 	shell.exec(`cd ${DIST_DIR} && hugo server --buildDrafts --disableLiveReload --disableFastRender`, {
			// 		async: true
			// 	})
			// }

			if (PRODUCTION_MODE) {
				const sourceMapsDir = `${DIST_DIR}/sourcemaps`
				if (fs.existsSync(sourceMapsDir)) {
					fs.cpSync(sourceMapsDir, `${BUILD_DIR}/sourcemaps`, { recursive: true })
					fs.rmSync(sourceMapsDir, { recursive: true, force: true })
				}
			}
		})
	],
	module: {
		rules: [
			{
				test: /\.(scss|css)$/,
				use: [
					{ loader: PRODUCTION_MODE || EXTRACT ? MiniCssExtractPlugin.loader : 'style-loader' },
					{ loader: 'css-loader', options: { sourceMap: true } },
					{ loader: 'sass-loader', options: { sourceMap: true } },
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							postcssOptions: {
								parser: 'postcss-scss',
								plugins: [['postcss-preset-env', {}]]
							}
						}
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader'
				},
				resolve: {
					fullySpecified: false
				}
			},
			{
				test: /\.(?:ico|gif|png|jpe?g|webp|avif|svg)$/i,
				type: 'asset/resource',
				generator: {
					filename: `img/${FILENAME}[ext]`
				}
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: `font/${FILENAME}[ext]`
				}
			},
			/* {
            test: /\.(json)$/i,
            type: 'asset/resource'
         }, */
			{
				test: /\.(frag|vert|glsl)$/,
				loader: 'glsl-shader-loader'
			},
			{
				...(PRODUCTION_MODE || STRIP
					? {
							test: /\.js$/,
							enforce: 'pre',
							exclude: /(node_modules|bower_components|\.spec\.js)/,
							use: [
								{
									loader: 'webpack-strip-code',
									options: {
										choiceArray: [
											{
												start: 'strip-start',
												end: 'strip-end'
											}
										]
									}
								}
							]
						}
					: {})
			}
		]
	},
	performance: {
		maxEntrypointSize: MAX_FILE_SIZE,
		maxAssetSize: MAX_FILE_SIZE
	},
	optimization: {
		...(PRODUCTION_MODE
			? {
					usedExports: true,
					minimize: true,
					minimizer: [
						// `...`,
						new CssMinimizerWebpackPlugin({
							exclude: 'style.css',
							minimizerOptions: {
								preset: [
									'default',
									{
										discardComments: { removeAll: true }
									}
								]
							}
						}),
						new TerserPlugin({
							minify: TerserPlugin.uglifyJsMinify,
							parallel: true,
							extractComments: true,
							terserOptions: {
								compress: {
									drop_console: !DEBUG
								}
							}
						})
					]
				}
			: {
					usedExports: false,
					runtimeChunk: {
						name: 'runtime'
					}
				})
	},
	...(PRODUCTION_MODE
		? {}
		: {
				devServer: {
					allowedHosts: 'all',
					historyApiFallback: true,
					static: {
						directory: resolve(DIST_DIR)
					},
					devMiddleware: {
						publicPath: resolve(DIST_DIR),
						writeToDisk: true
					},
					...(PROXY
						? {
								proxy: [
									{
										'*': {
											target: PROXY
											// secure: false,
											// changeOrigin: true
										}
									}
								]
							}
						: {}),
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Headers': '*',
						'Access-Control-Allow-Methods': '*'
					},
					open: false,
					compress: false,
					hot: true,
					liveReload: true,
					host: DEV_HOST,
					// port: PORT,
					setupMiddlewares: (middlewares) => {
						if (OPEN_BROWSER) {
							const localProxing = PROXY === DEV_HOST
							const baseUrl = localProxing ? pkg.baseUrl : PROXY.replace(DEV_HOST, `${DEV_HOST}:${PORT}`)
							const url = BROWSER_SYNC && localProxing ? `${baseUrl}:${PORT}` : baseUrl
							openBrowser(url)
						}
						return middlewares
					}
				}
			})
}
