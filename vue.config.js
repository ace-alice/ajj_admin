// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name } = require('./package.json');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const resolve = (dir) => path.join(__dirname, dir);

/**
 * @description boolean,是否是生产环境
 */
const isProd = ['prod', 'production'].includes(process.env.NODE_ENV);

/**
 * @description 开启gzip压缩
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { type } = require('os');

/**
 * @description 按需开启gzip压缩，压缩选取的文件类型
 */
const productinGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

/**
 * @description 打包分析，可以分析文件大小和文件包含内容
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

// 打包删除log
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const webpack = require('webpack');

const port = 8088;

module.exports = {
  /**
   * @description 项目部署的基础路径,默认假设你的应用将会部署在域名的根部,默认值 "/"
   */
  publicPath: '/',

  /**
   * @description 生成文件的目录名称（要和baseUrl的生产环境路径一致）
   */
  outputDir: 'c_master_static_admin',

  /**
   * @description 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
   */
  assetsDir: 'static',

  /**
   * @description 默认情况下 ，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。
   * 你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变)
   */
  filenameHashing: true,

  /**
   * @description lintOnSave：{ type:Boolean default:true } 问你是否使用eslint,设置为时true，eslint-loader将发出lint错误作为警告。
   * 默认情况下，警告仅记录到终端，并且不会使编译失败。
   */
  lintOnSave: false,

  /**
   * @description 是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，
   * 但是这会让你的应用额外增加 10kb 左右。(默认false)
   */
  runtimeCompiler: false,

  /**
   * @description 默认情况下babel-loader忽略其中的所有文件node_modules。如果要使用Babel显式转换依赖关系，可以在此选项中列出它
   */
  transpileDependencies: [],

  /**
   * @description 不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建,map就是为了方便打印错误位置。
   */
  productionSourceMap: false,

  /**
   * @description 将选项传递给与CSS相关的加载器
   * @param modules 默认情况下，只有以文件结尾的文件*.module.[ext]才会被视为CSS模块。将此设置为true允许您.module放入文件名并将所有*.(css|scss|sass|less|styl(us)?)文件视为CSS模块,
   * @param extract true在生产中，false在开发中,是否将组件中的CSS提取到独立的CSS文件中（而不是在JavaScript中内联并动态注入,在开发模式下禁用提取CSS，因为它与CSS热重新加载不兼容
   * @param sourceMap 是否为CSS启用源映射。将此设置为true可能会影响构建性能
   */
  // css: {
  //   modules: false,
  //   extract: true,
  //   sourceMap: false,
  //   loaderOptions: {
  //     css: {
  //       // options here will be passed to css-loader
  //     },
  //     postcss: {
  //       // options here will be passed to postcss-loader
  //     },
  //   },
  // },

  /**
   * @description 它支持webPack-dev-server的所有选项
   * @param port 开发环境端口
   * @param open 是否自动打开浏览器
   * @param https 开发环境是否使用https
   * @param proxy 配置代理
   */
  devServer: {
    port,
    open: true,
    https: false,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },

  /**
   * @description 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。
   */
  chainWebpack: (config) => {
    // 修复热更新失效
    config.resolve.symlinks(true);
    // console.log(config);

    // 解决 vue-i18n 加载警告
    config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js');

    // 添加文件夹别名
    config.resolve.alias.set('@views', resolve('src/views'));

    config.module.rule('svg').exclude.add(resolve('src/icons')).end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    // 配置图片压缩插件
    const imagesRule = config.module.rule('image');
    imagesRule
      .test(/\.(png|jpe?g|gif)(\?.*)?$/)
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({ disable: !isProd })
      .end();
  },

  /**
   * @description 如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中,如果这个值是一个函数，则会接收被解析的配置作为参数。该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。
   * @param {*} config
   */
  // configureWebpack: (config) => {
  //   const plugins = [];

  //   // 当生产环境时 开启 gzip 压缩
  //   if (isProd) {
  //     plugins.push(
  //       new CompressionWebpackPlugin({
  //         filename: '[path].gz[query]',
  //         algorithm: 'gzip',
  //         test: productinGzipExtensions,
  //         threshold: 10240,
  //         minRatio: 0.8
  //       }),
  //       new webpack.DefinePlugin({
  //         __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false)
  //       })
  //     );
  //     config.optimization.minimizer.push(
  //       new UglifyJsPlugin({
  //         uglifyOptions: {
  //           compress: {
  //             // warnings: false,
  //             drop_debugger: true, // 清除debugger語句
  //             drop_console: true,
  //             pure_funcs: ['console.log'] // 清除console
  //           }
  //         }
  //       })
  //     );
  //   }
  //   config.plugins = [...config.plugins, ...plugins];
  // },

  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    },
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: productinGzipExtensions,
        threshold: 10240,
        minRatio: 0.8
      }),
      new webpack.DefinePlugin({
        __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false)
      })
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              // warnings: false,
              drop_debugger: true, // 清除debugger語句
              drop_console: true,
              pure_funcs: ['console.log'] // 清除console
            }
          }
        })
      ]
    }
  }
};
