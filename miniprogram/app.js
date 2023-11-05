//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-9gf2x72e02966e63',
        traceUser: true,
      })
    }

    this.globalData = {
      openid:'',
      channel:'跑腿资讯',
      campus:'',
    }
  }
})
