class SyncPlugin {
  constructor({ filename }) {
    this.filename = filename
  }
  apply(compiler) {
    // tap call
    // tap callAsync
    // tapAsync callAsync
    // tapPromise promise
    // compilation 是 emit 钩子中传过来的
    compiler.hooks.emit.tap('SyncPlugin', compilation => {
      const assets = compilation.assets
      let content = `# 文件名   文件大小`
      Object.entries(assets).forEach(([filename, fileObj]) => {
        content += `\r\n- ${filename}   ${fileObj.size()}b`
      })
      content += `\r\n\r\n> 文件总个数：${Object.entries(assets).length} 个`
      compilation.assets[this.filename] = {
        source() {
          return content
        },
        size() {
          return content.length
        }
      }
    })
    // 可以设置 1s 后输出统计结果
    compiler.hooks.emit.tapAsync('SyncPlugin', (compilation, cb) => {
      setTimeout(() => {
        console.log('串行等待中');
        cb()
      }, 1000)
    })
    compiler.hooks.emit.tapPromise('SyncPlugin', compilation => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // console.log('串行等待中');
          resolve()
        }, 1000)
      })
    })
  }
}

module.exports = SyncPlugin