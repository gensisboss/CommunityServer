//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-1gsj1u740c14577b',
        traceUser: true,
      })
    }

    this.globalData = {
      openid:'',
      avatarUrl:'',
      nickName:'',
      online:false
    }
  }
})
