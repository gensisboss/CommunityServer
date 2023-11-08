// pages/detail/detail.js
const app = getApp();
const db = wx.cloud.database();

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
        creat: 0,
        isMy: false,

        commentText: '', // 用于绑定输入框的数据
        comments: [{
                content: '这是第一条评论',
                nickName: '微信用户',
                time: 1699458926582,
                avatarUrl: '../../images/head.png',
                subComment: [{
                    content: '这是第一条评论',
                    nickName: '微信用户',
                    time: 1699458926582,
                    avatarUrl: '../../images/head.png',
                },{
                    content: '这是第一条评论',
                    nickName: '微信用户',
                    time: 1699458926582,
                    avatarUrl: '../../images/head.png',
                }]
            },
           
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("界面数据", app.globalData.detailData)
        let data = app.globalData.detailData;
        this.setData({
            title: data.title,
            notes: data.notes,
            fileList: data.fileList,
            phone: data.phone,
            avatarUrl: data.avatarUrl,
            nickName: data.nickName,
            creat: data.creat,
            isMy: app.globalData.openid == data._openid
        })
    },


    replayComment: function (e) {

    },


    deleteItem: function () {
        let itemId = app.globalData.detailData._id;
        let collections = ["work", "second", "food"] // 所有可能的集合

        let deletePromises = collections.map(collection =>
            db.collection(collection).doc(itemId).remove()
        );

        Promise.race(deletePromises)
            .then(() => {
                wx.navigateBack({
                    delta: 0,
                })
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