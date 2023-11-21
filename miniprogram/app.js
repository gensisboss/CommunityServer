//app.js
const defaultTime = {
    defaultWorkTime: 25,
    defaultRestTime: 5
  }
  

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'market-7gck0fz3e1fe7679',
        traceUser: true,
      })
    }

    this.globalData = {
      openid:'',
      avatarUrl:'',
      nickName:'',
      online:true,
      detailData:'',
      officialChanngel:'',
      screenHeight:1336,
      screenWidth:750,
    }


    let workTime = wx.getStorageSync('workTime')
    let restTime = wx.getStorageSync('restTime')
    if (!workTime) {
      wx.setStorage({
        key: 'workTime',
        data: defaultTime.defaultWorkTime
      })
    }
    if (!restTime) {
      wx.setStorage({
        key: 'restTime',
        data: defaultTime.defaultRestTime
      })
    }

    
  }
})
