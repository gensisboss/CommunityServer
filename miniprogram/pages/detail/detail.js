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
        browser:0,
        
        baseName:'',
        commentText: '', // 用于绑定输入框的数据
        comments: [],

        online:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let data = app.globalData.detailData;
        this.setData({
            title: data.title,
            notes: data.notes,
            fileList: data.fileList,
            phone: data.phone,
            avatarUrl: data.avatarUrl,
            nickName: data.nickName,
            creat: data.creat,
            comments: data.comments,
            isMy: app.globalData.openid == data._openid,
            browser: data.browser+1
        })
        this.browser = data.browser+1;
        this.comments = data.comments;
        this.baseName = data.base;
    },


    onComment: function (event) {
        this.commentText = event.detail
    },

    onSubmit: function (e) {
        let that = this;
        if (that.commentText == '') {
            wx.showToast({
                title: '请输入评论',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        const docId = app.globalData.detailData._id;
        let comment = {
            openid : app.globalData.openid,
            content: that.commentText,
            nickName: app.globalData.nickName,
            time: new Date().getTime(),
            avatarUrl: app.globalData.avatarUrl,
            subComment: []
        }
        that.comments.push(comment)
        that.comments.sort((a,b)=>{return b.time-a.time})
        db.collection(this.baseName).doc(docId).update({
            // data 是一个对象，里面包含你想更新的字段
            data: {
                comments: that.comments,
            },
            success: function (res) {
                // 更新成功处理
                that.setData({
                    comments: that.comments
                })
            },
            fail: function (err) {
                // 更新失败处理
                console.error(err);
            }
        });

    },

    deleteComment: function (index) {
        const docId = app.globalData.detailData._id;
        let that = this;
        that.comments.splice(index,1)
        db.collection(this.baseName).doc(docId).update({
            // data 是一个对象，里面包含你想更新的字段
            data: {
                comments: that.comments,
            },
            success: function (res) {
                // 更新成功处理
                that.setData({
                    comments: that.comments
                })
            },
            fail: function (err) {
                // 更新失败处理
                console.error(err);
            }
        });
    },



    deleteItem: function () {
        let itemId = app.globalData.detailData._id;
        db.collection(this.baseName).doc(itemId).remove({
            success: function (res) {
                wx.navigateBack({
                    delta: 0,
                })
            },
            fail: function (err) {
                // 删除失败处理
                console.error(err);
            }
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
           online:app.globalData.online
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
        let that = this;
        const docId = app.globalData.detailData._id;
      
        db.collection(this.baseName).doc(docId).update({
            // data 是一个对象，里面包含你想更新的字段
            data: {
                browser: that.browser,
            },
            success: function (res) {
                // 更新成功处理
            },
            fail: function (err) {
                // 更新失败处理
                console.error(err);
            }
        });
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