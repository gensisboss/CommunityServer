// pages/my/my.js
const app = getApp();
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid: '',
        avatarUrl: '',
        nickName: '',
        online: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
            openid: app.globalData.openid,
            avatarUrl: app.globalData.avatarUrl,
            nickName: app.globalData.nickName,
            online: app.globalData.online
        })
        wx.setNavigationBarTitle({
            title: '设置'
        })
        this.setData({
            workTime: wx.getStorageSync('workTime'),
            restTime: wx.getStorageSync('restTime')
        })
    },

    changeWorkTime: function(e) {
        wx.setStorage({
            key: 'workTime',
            data: e.detail.value
        })
    },
    changeRestTime: function(e) {
        wx.setStorage({
            key: 'restTime',
            data: e.detail.value
        })
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