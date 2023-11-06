// pages/square/square.js
const app = getApp();
const db = wx.cloud.database();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        tab: '闲置宝贝',
        base: 'second',
        list: [],
        page: 0,

        //浮窗
        offsety: 0,
        x: "500px",
        y: "600px",

        anniu_show: -1, //做按钮显示限制，防止用户多次点击单个按钮
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {},



    //监听切换导航的变化
    onChange(event) {
        console.log(event.detail.title)
        let that = this;
        that.setData({
            tab: event.detail.title,
            page: 0,
        })
        that.shuju();

    },
    shuju: function () {
        let that = this;
        if (that.data.tab == '闲置宝贝') {
            that.base = 'second';
        }
        if (that.data.tab == '社区美食') {
            that.base = 'food';
        }
        if (that.data.tab == '工作推荐') {
            that.base = 'work';
        }
        if (that.data.tab == '我的发布') {
            this.getMyData();
            return;
        }
        that.getPageData();
    },

    //获取我的数据
    getMyData: function () {
        let that = this;
        Promise.all([
                db.collection('second').where({
                    _openid: app.globalData.openid
                }).orderBy('creat', 'desc').get(),
                db.collection('food').where({
                    _openid: app.globalData.openid
                }).orderBy('creat', 'desc').get(), db.collection('work').where({
                    _openid: app.globalData.openid
                }).orderBy('creat', 'desc').get(),
            ])
            .then(([res1, res2, res3]) => {
                const list1 = res1.data;
                const list2 = res2.data;
                const list3 = res3.data;
                that.setData({
                    list: list1.concat(list2.concat(list3))
                })
                wx.hideLoading()
            })
            .catch((e) => {
                wx.hideLoading()
                wx.showToast({
                    title: '搜索失败，请重试' + e,
                    icon: 'none',
                    duration: 2000
                })
            })
    },

    //获取数据
    getPageData: function () {
        let that = this;
        db.collection(that.base).orderBy('creat', 'desc').limit(20).get({
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

    fabu: function (e) {
        wx.navigateTo({
            url: "/pages/fabu/fabu",
        })
    },

    search: function (e) {
        wx.navigateTo({
            url: "/pages/search/search",
        })
    },

    showDetail: function (event) {
        app.globalData.detailData = event.detail.data;
        wx.navigateTo({
            url: "/pages/detail/detail",
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.getSystemInfo({
            success: res => {
                console.log(res)
                app.globalData.screenWidth = res.screenWidth;
                app.globalData.screenHeight = res.screenHeight;
                this.setData({
                    x: `${app.globalData.screenWidth-50}px`,
                    y: `${app.globalData.screenHeight-300}px`
                })
            },
            fail(err) {
                console.log(err);
            }
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        that.setData({
            anniu_show: -1,
        })
        that.shuju();
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
            anniu_show: -1,
        })
        that.shuju();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        //触底了就触发gengduo函数，去获取更多数据
    },

    /**
     * 拖拽移动
     */
    handleTouchMove: function (e) {
        let posY = e.detail.y;
        if (posY > app.globalData.screenHeight - 200) {
            posY = app.globalData.screenHeight - 200;
        }
        if (posY < 100) {
            posY = 100;
        }
        this.setData({
            offsety: posY
        })
    },

    /**
     * 拖拽结束
     */
    handleTouchEnd: function (e) {
        this.setData({
            x: `${app.globalData.screenWidth-50}px`,
            y: `${this.data.offsety}px`
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})