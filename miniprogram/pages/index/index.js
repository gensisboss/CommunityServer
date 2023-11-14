// pages/index/index.js
const app = getApp();
const db = wx.cloud.database();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        autoplay: true,
        circular: true,
        banner: [],
        list: [],
        nomore: false,
        page: 0,
        tongzhi: '',
        online: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        wx.showLoading({
            title: '加载中',
        })
        wx.getStorage({
            key: 'openid',
            success(res) {
                //把缓存的openid赋给全局变量openid
                app.globalData.openid = res.data;
                console.log("玩家的openid", res)
            },
            fail(er) {
                //第一次进来没有这个openid缓存，可以获取存进去
                //获取用户的_openid
                that.get_openid();
            }
        })

        wx.getStorage({
            key: 'avatarUrl',
            success(res) {
                //把缓存的openid赋给全局变量openid
                app.globalData.avatarUrl = res.data;
                console.log("玩家的头像", res)
            },
            fail(er) {
                app.globalData.avatarUrl = '../../images/head.png';
                wx.setStorage({
                    key: "avatarUrl",
                    data: '../../images/head.png',
                })
            }
        })

        wx.getStorage({
            key: 'nickName',
            success(res) {
                //把缓存的openid赋给全局变量openid
                app.globalData.nickName = res.data;
                console.log("玩家的昵称", res)
            },
            fail(er) {
                app.globalData.nickName = "微信用户";
                wx.setStorage({
                    key: "nickName",
                    data: '微信用户',
                })
            }
        })
        //获取轮播图
        that.get_banner();

    },
    get_tongzhi: function () {
        let that = this;
        console.log("获取通知信息")
        db.collection('tongzhi').limit(1).get({
            success: function (res) {
                that.setData({
                    tongzhi: res.data[0].tip,
                    online: res.data[0].online
                })
                console.log("当前通知信息", res)
                app.globalData.online = res.data[0].online
                //关闭加载
                wx.hideLoading()
            }
        })
    },
    get_banner: function () {
        let that = this;
        db.collection('banner').limit(3).get({
            success: function (res) {
                that.setData({
                    banner: res.data,
                })
            }
        })
    },
    get_openid: function () {
        console.log("获取openid")
        wx.cloud.callFunction({ //  调用云函数获取openid
            name: 'login',
            success: function (res) {
                console.log("openid数据", res)
                app.globalData.openid = res.result.userInfo.openId;
                //把openid放到缓存里面
                wx.setStorage({
                    key: "openid",
                    data: res.result.userInfo.openId
                })
            },
            fail: function (res) {
                console.log("openid获取失败", res)
            }
        })
    },
    //监听切换导航的变化（推荐、新闻）
    onChange(event) {
        if (event.detail.title == '推荐') {
            this.getPageData("official")
        }
        if (event.detail.title == '新闻') {
            this.getPageData("new")
        }

    },

    showDetail: function (event) {
        app.globalData.detailData = event.detail.data;
        wx.navigateTo({
            url: "/pages/detail/detail",
        })
    },

    //获取数据
    getPageData: function (base) {
        console.log(base)
        let that = this;
        db.collection(base).orderBy('creat', 'desc').limit(20).get({
            success: function (res) {
                that.setData({
                    list: res.data,
                })
                wx.hideLoading()
                console.log(res)
            },
            fail(er) {
                wx.hideLoading()
                console.log(er)
            }
        })
    },



    go: function (e) {
        console.log(e.currentTarget.dataset.id)
        wx.navigateTo({
            url: e.currentTarget.dataset.id,
        })
    },
    //待开发
    daikaifa: function () {
        let that = this;
        wx.showToast({
            title: '待开发，请耐心等待',
            icon: 'none',
            duration: 2000
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

        //获取公告通知
        this.get_tongzhi();
        this.getPageData("official")
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
        //触底了就触发gengduo函数，去获取更多数据
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})