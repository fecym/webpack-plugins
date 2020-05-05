class SyncPlugin {
  apply(compiler) {
    // tap call
    // tap callAsync
    // tapAsync callAsync
    // tapPromise promise
    // compilation 是 emit 钩子中传过来的
    compiler.hooks.emit.tap('SyncPlugin', compilation => {
      // console.log("SyncPlugin -> apply -> compilation", Object.keys(compilation))
      // console.log("SyncPlugin -> apply -> compilation", compilation.assets)
      // console.log("SyncPlugin -> apply -> compilation", compilation.assets['index.html'])
      compilation.assets['index.txt'] = {
        source() {
          return 'hello world'
        },
        size() {
          return 5
        }
      }
    })
  }
}

module.exports = SyncPlugin