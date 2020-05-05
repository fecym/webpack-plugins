const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SyncPlugin = require('./plugins/SyncPlugin')
const InlineWebpackPlugin = require('./plugins/InlineSourcePlugin')
const UploadPlugin = require('./plugins/UploadPlugin')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'index.css'
    }),
    new HtmlWebpackPlugin(),
    // 记录所有文件的名字和文件的大小
    // 注意插件之间的依赖关系
    new SyncPlugin({
      filename: 'r.md',
    }),
    new InlineWebpackPlugin({
      match: /\.(js|css)$/
    }),
    // 七牛云上传
    new UploadPlugin({
      bucket: 'cymstatic',
      accessKey: 'OautsMKxZckNNUZJv1z3__8s1agvxTgvGLkvPru8',
      secretKey: 'Wh3MBq1_24t-b_OfvP1nYVTBSdfpp7rqkC-OgM2d'
    })
  ]
}

// 内联 webpack 插件，封装第三方插件，使用第三方插件的钩子函数处理文件