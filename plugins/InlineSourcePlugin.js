const HtmlWebpackPlugin = require('html-webpack-plugin');
/**
 * 封装 html-webpack-plugin
 * 把外链的文件转化成行内的样式或者脚本
 */
class MyPlugin {
  constructor(options) {
    this.match = options.match || /\.(js|css)$/
  }
  processTag(tag, compilation) {
    // 取到匹配的 css 路径和 js 路径
    // 把 link 标签转换为 style
    // 把 script 转换
    const url = tag.attributes.href || tag.attributes.src
    if (this.match.test(url)) {
      if (tag.tagName === 'link') {
        tag = {
          tagName: 'style',
          innerHTML: compilation.assets[url].source()
        }
      }
      if (tag.tagName === 'script') {
        tag = {
          tagName: 'script',
          innerHTML: compilation.assets[url].source()
        }
      }
      // 因为已经把引入的文件转换成行内了，所以需要把文件从打包的资源中删除掉
      delete compilation.assets[url]
    }
    return tag
  }
  processTags(data, compilation) {
    let headTags = data.headTags
    let bodyTags = data.bodyTags
    headTags = headTags.map(tag => {
      // console.log("MyPlugin -> headTags -> tag", tag)
      return this.processTag(tag, compilation)
    })
    bodyTags = bodyTags.map(tag => {
      // console.log("MyPlugin -> bodyTags -> tag", tag)
      return this.processTag(tag, compilation)
    })
    return { ...data, headTags, bodyTags }
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      console.log('The compiler is starting a new compilation...')

      // Static Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
        'MyPlugin', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          // console.log("MyPlugin -> apply -> data", data)
          data = this.processTags(data, compilation)
          cb(null, data)
        }
      )
    })
  }
}

module.exports = MyPlugin