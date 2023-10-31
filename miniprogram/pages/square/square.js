// pages/square/square.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
         tab:'全部',
         list:[],
         nomore:false,
         page:0,

         //中间值
         cost:0,
         anniu_show:-1,          //做按钮显示限制，防止用户多次点击单个按钮
		 kejin:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       
  },


  
  //监听切换导航的变化
  onChange(event) {
    console.log(event.detail.title)
    let that = this;
    that.setData({
        tab:event.detail.title,
        page:0,
    })
    that.shuju();
    
  },
  shuju:function(){
        let that = this;
        
        if(that.data.tab=='闲置宝贝'){
            that.get();
            
         }
         if(that.data.tab=='社区美食'){
           //获取待接单的单子列表
            that.get_dai();
         }
         if(that.data.tab=='工作推荐'){
           //获取配送中的单子列表
            that.get_song();
         }
         if(that.data.tab=='无限畅聊'){
          //获取已完成的单子列表
           that.get_que();
         }
  },

  //获取单子列表
  //publish表里的字段state等于1代表待接单，2代表配送中，3代表已完成，4代表已取消，5代表待确认
  get:function(){
    let that = this;
    db.collection('publish').where({
         _openid:app.globalData.openid,
    }).orderBy('creat', 'desc').limit(20).get({
      success:function(res){
           console.log(res)
           that.setData({
             list:res.data,
           })
           wx.stopPullDownRefresh(); //暂停刷新动作
      },
      fail(){
         //提示用户获取失败
         wx.showToast({
           title: '获取失败，请重新获取',
           icon: 'none',
           duration: 2000
         })
         wx.stopPullDownRefresh(); //暂停刷新动作
      }
    })
  },
  //获取待接单的单子列表
  get_dai:function(){
    let that = this;
    db.collection('publish').where({
      state:1,
      _openid:app.globalData.openid,
    }).orderBy('creat', 'desc').limit(20).get({
      success:function(res){
           console.log(res)
           that.setData({
             list:res.data,
           })
           wx.stopPullDownRefresh(); //暂停刷新动作
      },
      fail(){
         //提示用户获取失败
         wx.showToast({
           title: '获取失败，请重新获取',
           icon: 'none',
           duration: 2000
         })
         wx.stopPullDownRefresh(); //暂停刷新动作
      }
    })
  },
  //获取配送中的单子列表
  get_song:function(){
    let that = this;
    db.collection('publish').where({
      state:2,
      _openid:app.globalData.openid,
    }).orderBy('creat', 'desc').limit(20).get({
      success:function(res){
           console.log(res)
           that.setData({
             list:res.data,
           })
           wx.stopPullDownRefresh(); //暂停刷新动作
      },
      fail(){
         //提示用户获取失败
         wx.showToast({
           title: '获取失败，请重新获取',
           icon: 'none',
           duration: 2000
         })
         wx.stopPullDownRefresh(); //暂停刷新动作
      }
    })
  },
  //获取待确认的单子列表
  get_que:function(){
    let that = this;
    db.collection('publish').where({
      state:5,
      _openid:app.globalData.openid,
    }).orderBy('creat', 'desc').limit(20).get({
      success:function(res){
           console.log(res)
           that.setData({
             list:res.data,
           })
           wx.stopPullDownRefresh(); //暂停刷新动作
      },
      fail(){
         //提示用户获取失败
         wx.showToast({
           title: '获取失败，请重新获取',
           icon: 'none',
           duration: 2000
         })
         wx.stopPullDownRefresh(); //暂停刷新动作
      }
    })
  },
   //获取已完成的单子列表
   get_wan:function(){
    let that = this;
    db.collection('publish').where({
      state:3,
      _openid:app.globalData.openid,
    }).orderBy('creat', 'desc').limit(20).get({
      success:function(res){
           console.log(res)
           that.setData({
             list:res.data,
           })
           wx.stopPullDownRefresh(); //暂停刷新动作
      },
      fail(){
         //提示用户获取失败
         wx.showToast({
           title: '获取失败，请重新获取',
           icon: 'none',
           duration: 2000
         })
         wx.stopPullDownRefresh(); //暂停刷新动作
      }
    })
  },
   //获取已取消的单子列表
   get_qu:function(){
    let that = this;
    db.collection('publish').where({
      state:4,
      _openid:app.globalData.openid,
    }).orderBy('creat', 'desc').limit(20).get({
      success:function(res){
           console.log(res)
           that.setData({
             list:res.data,
           })
           wx.stopPullDownRefresh(); //暂停刷新动作
      },
      fail(){
         //提示用户获取失败
         wx.showToast({
           title: '获取失败，请重新获取',
           icon: 'none',
           duration: 2000
         })
         wx.stopPullDownRefresh(); //暂停刷新动作
      }
    })
  },

  //获取更多数据
  gengduo:function() {
    let that = this;
    if (that.data.nomore || that.data.list.length < 20) {
      return false
    }
    if(that.data.tab=='全部'){
      let page = that.data.page + 1;
      //经过上一句执行，page的值已经为1了，所以下面的page*20=20
      db.collection('publish').where({
            _openid:app.globalData.openid,
      }).orderBy('creat', 'desc').skip(page * 20).limit(20).get({
            success: function(res) {
                  if (res.data.length == 0) {
                        that.setData({
                              nomore: true
                        })
                        return false;
                  }
                  if (res.data.length < 20) {
                        that.setData({
                              nomore: true
                        })
                  }
                  //取到成功后，都连接到旧数组，然后组成新数组
                  that.setData({
                        //这里的page为1，即新页面
                        page: page,
                        list: that.data.list.concat(res.data)
                  })
            },
            fail() {
                  wx.showToast({
                        title: '获取失败',
                        icon: 'none'
                  })
            }
      })
    }
    if(that.data.tab=='待接单'){
      let page = that.data.page + 1;
      //经过上一句执行，page的值已经为1了，所以下面的page*20=20，下标20就是第21条记录
      db.collection('publish').where({
         state:1,
         _openid:app.globalData.openid,
      }).orderBy('creat', 'desc').skip(page * 20).limit(20).get({
            success: function(res) {
                  if (res.data.length == 0) {
                        that.setData({
                              nomore: true
                        })
                        return false;
                  }
                  if (res.data.length < 20) {
                        that.setData({
                              nomore: true
                        })
                  }
                  //取到成功后，都连接到旧数组，然后组成新数组
                  that.setData({
                        //这里的page为1，
                        page: page,
                        list: that.data.list.concat(res.data)
                  })
            },
            fail() {
                  wx.showToast({
                        title: '获取失败',
                        icon: 'none'
                  })
            }
      })
    }
    if(that.data.tab=='配送中'){
      let page = that.data.page + 1;
      //经过上一句执行，page的值已经为1了，所以下面的page*20=20
      db.collection('publish').where({
        state:2,
        _openid:app.globalData.openid,
     }).orderBy('creat', 'desc').skip(page * 20).limit(20).get({
            success: function(res) {
                  if (res.data.length == 0) {
                        that.setData({
                              nomore: true
                        })
                        return false;
                  }
                  if (res.data.length < 20) {
                        that.setData({
                              nomore: true
                        })
                  }
                  //取到成功后，都连接到旧数组，然后组成新数组
                  that.setData({
                        //这里的page为1，
                        page: page,
                        list: that.data.list.concat(res.data)
                  })
            },
            fail() {
                  wx.showToast({
                        title: '获取失败',
                        icon: 'none'
                  })
            }
      })
    }
    if(that.data.tab=='待确认'){
      let page = that.data.page + 1;
      //经过上一句执行，page的值已经为1了，所以下面的page*20=20
      db.collection('publish').where({
        state:5,
        _openid:app.globalData.openid,
     }).orderBy('creat', 'desc').skip(page * 20).limit(20).get({
            success: function(res) {
                  if (res.data.length == 0) {
                        that.setData({
                              nomore: true
                        })
                        return false;
                  }
                  if (res.data.length < 20) {
                        that.setData({
                              nomore: true
                        })
                  }
                  //取到成功后，都连接到旧数组，然后组成新数组
                  that.setData({
                        //这里的page为1，
                        page: page,
                        list: that.data.list.concat(res.data)
                  })
            },
            fail() {
                  wx.showToast({
                        title: '获取失败',
                        icon: 'none'
                  })
            }
      })
    }
    if(that.data.tab=='已完成'){
      let page = that.data.page + 1;
      //经过上一句执行，page的值已经为1了，所以下面的page*20=20
      db.collection('publish').where({
        state:3,
        _openid:app.globalData.openid,
     }).orderBy('creat', 'desc').skip(page * 20).limit(20).get({
            success: function(res) {
                  if (res.data.length == 0) {
                        that.setData({
                              nomore: true
                        })
                        return false;
                  }
                  if (res.data.length < 20) {
                        that.setData({
                              nomore: true
                        })
                  }
                  //取到成功后，都连接到旧数组，然后组成新数组
                  that.setData({
                        //这里的page为1，
                        page: page,
                        list: that.data.list.concat(res.data)
                  })
            },
            fail() {
                  wx.showToast({
                        title: '获取失败',
                        icon: 'none'
                  })
            }
      })
    }
    if(that.data.tab=='已取消'){
      let page = that.data.page + 1;
      //经过上一句执行，page的值已经为1了，所以下面的page*20=20
      db.collection('publish').where({
        state:4,
        _openid:app.globalData.openid,
     }).orderBy('creat', 'desc').skip(page * 20).limit(20).get({
            success: function(res) {
                  if (res.data.length == 0) {
                        that.setData({
                              nomore: true
                        })
                        return false;
                  }
                  if (res.data.length < 20) {
                        that.setData({
                              nomore: true
                        })
                  }
                  //取到成功后，都连接到旧数组，然后组成新数组
                  that.setData({
                        //这里的page为1，
                        page: page,
                        list: that.data.list.concat(res.data)
                  })
            },
            fail() {
                  wx.showToast({
                        title: '获取失败',
                        icon: 'none'
                  })
            }
      })
    }
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
      that.setData({
            anniu_show:-1,
      })
      //实时刷新单子列表
      if(that.data.tab=='全部'){
          that.get();
       }
       if(that.data.tab=='待接单'){
         //获取待接单的单子列表
          that.get_dai();
       }
       if(that.data.tab=='配送中'){
         //获取配送中的单子列表
          that.get_song();
       }
       if(that.data.tab=='待确认'){
        //获取待确认的单子列表
         that.get_que();
      }
       if(that.data.tab=='已完成'){
        //获取已完成的单子列表
         that.get_wan();
       }
       if(that.data.tab=='已取消'){
         //获取已取消的单子列表
          that.get_qu();
       }
       
         
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
      let that = this;
      that.setData({
            anniu_show:-1,
      })
      that.shuju();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //触底了就触发gengduo函数，去获取更多数据
    this.gengduo();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})