// pages/detail/detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
        title: '',
        notes: '',
        fileList: [],
        phone: '',
        avatarUrl: '',
        nickName: '',
        creat: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        console.log("界面数据",app.globalData.detailData)
        let data = app.globalData.detailData;
        this.setData({
            title : data.title,
            notes : data.notes,
            fileList : data.fileList,
            phone : data.phone,
            avatarUrl : data.avatarUrl,
            nickName : data.nickName,
            creat : data.creat  
        })
          
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})