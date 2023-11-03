// pages/ziliao/ziliao.js
const app = getApp();
const db = wx.cloud.database();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl: '../../images/head.png',
        nickName: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.get_campus();
    },
    getUserProfile(e) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        let that = this;
        if (that.data.userInfo !== '') {
            that.check();
        }
        if (that.data.userInfo == '') {
            wx.getUserProfile({
                desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    that.setData({
                        avatarUrl: res.userInfo.avatarUrl,
                        nickName: res.userInfo.nickName,
                    })
                    that.check();
                },
                fail() {
                    wx.showToast({
                        title: '请授权后方可使用',
                        icon: 'none',
                        duration: 2000
                    });
                }
            })
        }

    },



    // 上传图片
    uploadToCloud(event) {
        let that = this;

        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                wx.showLoading({
                    title: '正在上传',
                })
                console.log(res)
                that.setData({
                    linshi: that.data.linshi.concat(res.tempFilePaths)
                })
                console.log(that.data.linshi)
                //临时数组
                let lujin = "bangmai_img/" + new Date().getTime() + "-" + Math.floor(Math.random() * 1000);
                const uploadTasks = that.data.linshi.map((item, index) => that.uploadFilePromise(lujin + index, item)); //传给wx.cloud.uploadFile的cloudPath属性的值不能重复！！！巨坑，加个index就可以避免重复了
                Promise.all(uploadTasks)
                    .then(data => {
                        console.log(data)
                        wx.hideLoading()
                        wx.showToast({
                            title: '上传成功',
                            icon: 'none'
                        });
                        const newFileList = data.map(item => ({
                            url: item.fileID,
                            isImage: true,
                        }));
                        console.log(newFileList)
                        //每次上传成功后，都要清空一次临时数组，避免第二次重复上传，浪费存储资源，
                        that.setData({
                            fileList: that.data.fileList.concat(newFileList),
                            linshi: [],
                        });

                    })
                    .catch(e => {
                        wx.showToast({
                            title: '上传失败',
                            icon: 'none'
                        });
                        console.log(e);
                    });

            }
        })


    },
    //上传到云存储，并且获得图片新路径
    uploadFilePromise(fileName, chooseResult) {
        return wx.cloud.uploadFile({
            cloudPath: fileName,
            filePath: chooseResult
        });
    },
    //预览图片
    previewImage: function (event) {
        let that = this;
        console.log(event)
        wx.previewImage({
            urls: [event.currentTarget.dataset.url] // 需要预览的图片http链接列表
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