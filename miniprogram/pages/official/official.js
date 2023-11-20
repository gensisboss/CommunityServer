// pages/square/square.js
const app = getApp();
const db = wx.cloud.database();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        base:'',
        list: [],
        page: 0,        
        online:false,

    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        let tab = app.globalData.officialChanngel
        wx.setNavigationBarTitle({
            title: tab
        });
        if (tab == '生活') {
            that.base = 'life';
        }
        if (tab == '周边') {
            that.base = 'around';
        }
        if (tab == '公告') {
            that.base = 'official';
        }
    },



    //获取数据
    getOfficialData: function () {
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
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this;
        that.setData({
            online: app.globalData.online
        })
        that.getOfficialData();
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
        that.getOfficialData();
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