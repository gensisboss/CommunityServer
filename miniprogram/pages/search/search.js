// pages/search/search.js
const app = getApp();
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
       list:[],
       nomore:false,
       page:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
  },

  //搜索帖子
  onSearch:function(event){
    let that = this;
    console.log(event.detail)
    wx.showLoading({
      title: '正在搜索',
    })
    db.collection('second').where({
        search_name:db.RegExp({
          regexp: '.*' + event.detail + '.*',
          options: 'i',
       })
    }).orderBy('creat','desc').get({
      success:function(res){
            that.setData({
               list:res.data
            })
            wx.hideLoading()
      },
      fail(er){
           wx.hideLoading()
           wx.showToast({
            title: '搜索失败，请重试',
            icon: 'none',
            duration: 2000
          })
      }
    })
   
  },

  showDetail:function(event){
    app.globalData.detailData = event.detail.data;
    wx.navigateTo({
        url: "/pages/detail/detail",
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
      let that = this;
     
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
  //获取更多数据
  get_more:function(){
    let that = this;
    if (that.data.nomore || that.data.list.length < 20) {
      wx.showToast({
        title: '没有更多了',
      })
      return false
    }
    let page = that.data.page + 1;
     
      //经过上一句执行，page的值已经为1了，所以下面的page*20=20，下标20就是第21条记录
      db.collection('second').where({
         choose_campus:app.globalData.campus,
      }).orderBy('creat', 'desc').skip(page * 20).limit(20).get({
            success: function(res) {
                  console.log(res)
                  if (res.data.length == 0) {
                        that.setData({
                              nomore: true
                        })
                  }
                  if (res.data.length < 20) {
                        that.setData({
                              nomore: true
                        })
                        //取到成功后，都连接到旧数组，然后组成新数组
                        that.setData({
                              //这里的page为1
                              page: page,
                              list: that.data.list.concat(res.data)
                        })
                  }
            },
            fail() {
                  wx.showToast({
                        title: '获取失败',
                        icon: 'none'
                  })
            }
      })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
       let that = this;
       that.get_more();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
