const qiniu = require('qiniu')
const path = require('path')

// 文件打包完成之后上传七牛云
class UploadPlugin {
  constructor(options = {}) {
    const { bucket = '', accessKey = '', secretKey = '' } = options
    // 定义鉴权对象mac，文档有
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    // 简单上传的凭证
    const putPolicy = new qiniu.rs.PutPolicy({ scope: bucket })
    this.uploadToken = putPolicy.uploadToken(mac)
    const config = new qiniu.conf.Config()
    this.formUploader = new qiniu.form_up.FormUploader(config)
    this.putExtra = new qiniu.form_up.PutExtra()
  }
  apply(compiler) {
    // 当文件发射文成之后监听 promise 事件
    compiler.hooks.afterEmit.tapPromise('UploadePlugin', compilation => {
      const assets = compilation.assets
      const promises = []
      Object.keys(assets).forEach(filename => {
        promises.push(this.upload(filename))
      })
      return Promise.all(promises)
    })
  }
  upload(filename) {
    return new Promise((resolve, reject) => {
      const realPath = path.resolve(__dirname, '../dist/', filename)
      this.formUploader.putFile(this.uploadToken, filename, realPath, this.putExtra, (err, body) => {
        err ? reject(err) : resolve(body)
      })
    })
  }
}

module.exports = UploadPlugin