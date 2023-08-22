const webpack = require("webpack");
const path = require('path');
const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin"); // 分析打包时间
const ProgressBarPlugin = require("progress-bar-webpack-plugin"); // 打包进度显示
const postcssVw = require('postcss-px-to-viewport');
const autoprefixer = require('autoprefixer');

// 自定义换肤
const ThemeColorReplacer = require('webpack-theme-color-replacer');
const forElementUI = require('webpack-theme-color-replacer/forElementUI');
const appConfig = require('./src/theme/app-config.ts');

function resolve(dir) { return path.join(__dirname, dir) }

const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const isProduction = process.env.NODE_ENV !== "development";
const isDev = process.env.NODE_ENV; // 当前的环境

/**
 *  打包时切换成 false
 */
const devNeedCdn = isDev === "production" ? false : true;
const cdn = {
    externals: {
        "vue": "Vue",
        "vuex": "Vuex",
        "vue-router": "VueRouter",
        "axios": "axios",
        "vue-i18n": "VueI18n",
        "element-ui": "ELEMENT",
        "scrollReveal": "ScrollReveal",
        "xlsx": "xlsx",
        "echarts": "echarts"
    },
    css: [
        "https://lib.baomitu.com/element-ui/2.15.7/theme-chalk/index.min.css"
    ],
    js: [
        "https://lib.baomitu.com/vue/2.6.12/vue.min.js",
        "https://lib.baomitu.com/vue-router/3.5.1/vue-router.min.js",
        "https://lib.baomitu.com/vuex/3.6.2/vuex.min.js",
        "https://lib.baomitu.com/axios/0.21.1/axios.min.js",
        "https://lib.baomitu.com/vue-i18n/8.24.2/vue-i18n.min.js",
        "https://lib.baomitu.com/element-ui/2.15.7/index.min.js",
        "https://lib.baomitu.com/element-ui/2.15.7/locale/en.min.js",
        "https://lib.baomitu.com/element-ui/2.15.7/locale/zh-CN.min.js",
        "https://lib.baomitu.com/scrollReveal.js/4.0.9/scrollreveal.min.js",
        "https://lib.baomitu.com/xlsx/0.16.9/xlsx.core.min.js",
        "https://lib.baomitu.com/echarts/5.1.0/echarts.min.js"
    ]
}

let isDevCS = {
    '/api': {
        target: "http://192.168.1.104:10086",
        changeOrigin: true,
        wx: true,
        pathRewrite: {
            "^/api": "/"
        }
    }
}

/**
 *  production：生产环境，development：开发环境
 *  config.mode = process.env.NODE_ENV
 *  devServer: {
 *    open: false,
 *    https: false,
 *    proxy: baseUrl
 *  },
 *  publicPath: isDev === 'production' ? '/' : '/',
 * NUoXRtmGyM
 */
module.exports = {
    publicPath: isDev === "production" ? "/NUoXRtmGyM" : "/wcw/admin/",
    outputDir: isDev === "production" ? "wcw-admin-prod" : "wcw-admin-dev",
    runtimeCompiler: true,
    productionSourceMap: devNeedCdn,
    lintOnSave: false,
    chainWebpack: (config) => {
        if (isDev === 'production') {
            config.plugins.delete('prefetch');
            config.plugins.delete('preload');
        }
        // ============注入cdn start============
        config.plugin('html').tap(args => {
            // 生产环境或本地需要cdn时，才注入cdn
            if (isProduction || devNeedCdn) args[0].cdn = cdn;
            return args
        });
        // ============注入cdn end==============
        config.entry('main').add('babel-polyfill')
        config.resolve.alias
            .set("@", resolve("src"))
            .set("@img", resolve("src/assets/images"))
            .set("@css", resolve("src/assets/styles/css"))
            .set("@scss", resolve("src/assets/styles/scss"))

        config
            .plugin('speed-measure-webpack-plugin')
            .use(SpeedMeasurePlugin)
            .end()

        config.plugin('provide').use(webpack.ProvidePlugin, [{
            'window.Quill': 'quill/dist/quill.js',
            'Quill': 'quill/dist/quill.js'
        }])

        // 自定义换肤
        config.plugin('webpack-theme-color-replacer')
            .use(ThemeColorReplacer)
            .tap(options => {
                options[0] = {
                    fileName: 'css/theme-colors-[contenthash:8].css',
                    matchColors: [ // 自定义颜色
                        ...forElementUI.getElementUISeries(appConfig.themeColor),
                        '#7fffd4',
                        '#efefef',
                    ],
                    changeSelector: forElementUI.changeSelector,
                    isJsUgly: isProduction
                }
                return options
            })
    },
    transpileDependencies: [
        'biyi-admin',
    ],
    configureWebpack: config => {
        // 生产环境打包分析体积
        if (isProduction || devNeedCdn) config.externals = cdn.externals;
        if (isDev === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
            config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log'];
            config.plugins.push(
                // 压缩代码
                new CompressionPlugin({
                    algorithm: 'gzip',
                    filename: '[path].gz[query]',
                    test: productionGzipExtensions,
                    threshold: 10240,
                    minRatio: 0.8,
                    deleteOriginalAssets: false
                }),
                // 体积压缩提示
                new BundleAnalyzerPlugin(),
                // 打包进度显示
                new ProgressBarPlugin()
            )
        }
    },
    css: {
        extract: true,
        loaderOptions: {
            sass: {
                data: `
          @import '@/assets/styles/theme.scss';
          @import '@/assets/styles/global.scss';
          @import "@/assets/styles/mixin.scss";
          @import '@/assets/styles/_var.scss';
        `
            },
            postcss: {
                // plugins: [
                //     // require('postcss-px2rem')({
                //     //   remUnit: 16
                //     // }),
                //     new autoprefixer(),
                //     new postcssVw({
                //         unitToConvert: 'px',
                //         viewportWidth: 1920,
                //         viewportHeight: 1080,
                //         unitPrecision: 3,
                //         propList: ['*'],
                //         viewportUnit: 'vw',
                //         fontViewportUnit: 'vw',
                //         selectorBlackList: ['.ignore-', '.panel-', '.el-', 'ivu-', ],
                //         minPixelValue: 1,
                //         mediaQuery: false,
                //         replace: true,
                //         exclude: [/node_modules/], //忽略某些文件夹下的文件或特定文件
                //         landscape: false,
                //         landscapeUnit: 'vw',
                //         landscapeWidth: 1134
                //     })
                // ]
            }
        }
    },
    // 第三方插件的选项
    pluginOptions: {}
};