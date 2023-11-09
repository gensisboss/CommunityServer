// pages/ziliao/ziliao.js
const app = getApp();
const db = wx.cloud.database();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl: '',
        nickName: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
    },
    getUserProfile(e) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        let that = this;

        wx.getUserProfile({
            desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                that.setData({
                    avatarUrl: res.userInfo.avatarUrl,
                    nickName: res.userInfo.nickName,
                })
                wx.setStorage({
                    key: "avatarUrl",
                    data: res.userInfo.avatarUrl,
                })
                that.nickName = res.userInfo.nickName;
                app.globalData.avatarUrl = res.userInfo.avatarUrl;  
            },
            fail() {
                wx.showToast({
                    title: '请授权后方可使用',
                    icon: 'none',
                    duration: 2000
                });
            }
        })

    },

    setUserProfile(e){
        let that = this;
        app.globalData.nickName = that.nickName;
        wx.setStorage({
            key: "nickName",
            data: that.nickName,
        })
       

        wx.navigateBack({
            delta: 0,
        })
    },

    nickNameInput: function (e) {
        let that = this;
        that.nickName = e.detail;
        console.log("玩家的昵称", that.nickName)
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
            avatarUrl: app.globalData.avatarUrl,
            nickName: app.globalData.nickName
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