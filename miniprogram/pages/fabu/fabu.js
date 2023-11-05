// pages/fabu/fabu.js
const app = getApp();
const db = wx.cloud.database();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        title: '',
        notes: '',
        note_counts: 0,
        multiple: true,
        fileList: [],
        linshi: [],  //存放图片的临时地址
        phone: '',
        avatarUrl: '',
        nickName: '',
        userInfo: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       
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
                        userInfo: res.userInfo,
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


    check: function () {
        let that = this;
        if (that.data.title == '') {
            wx.showToast({
                title: '请输入标题',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if (that.data.phone == '') {
            wx.showToast({
                title: '请输入手机号码',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if (that.data.fileList.length == 0) {
            wx.showToast({
                title: '请上传闲置物品图片',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if (that.data.notes == '') {
            wx.showToast({
                title: '请输入相关说明',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        that.fabu();
    },

    fabu: function () {
        let that = this;
        db.collection('second').add({
            data: {
                title: that.data.title,
                phone: that.data.phone,
                fileList: that.data.fileList,
                notes: that.data.notes,
                creat: new Date().getTime(),
                search_name:  that.data.title,
                avatarUrl: that.data.avatarUrl,
                nickName: that.data.nickName,
            },
            success: function (res) {
                wx.hideLoading()
                wx.showToast({
                    title: '发布成功',
                    icon: 'success',
                    duration: 2000
                })
                setTimeout(function () {
                    wx.navigateBack({
                        delta: 0,
                    })
                }, 1000)
            },
            fail(er) {
                console.log(er)
                wx.hideLoading()
                wx.showToast({
                    title: '发布失败,请重试',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
  
    // 上传图片
    uploadToCloud(event) {
        let that = this;

        wx.chooseImage({
            count: 3,
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
                        const newFileList = data.map(item => ({ url: item.fileID, isImage: true, }));
                        console.log(newFileList)
                        //每次上传成功后，都要清空一次临时数组，避免第二次重复上传，浪费存储资源，
                        that.setData({
                            fileList: that.data.fileList.concat(newFileList),
                            linshi: [],
                        });

                    })
                    .catch(e => {
                        wx.showToast({ title: '上传失败', icon: 'none' });
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
            urls: [event.currentTarget.dataset.url] 
        })
    },
    //删除图片
    delete: function (event) {
        let that = this;
        console.log(event)
        let inde = event.currentTarget.dataset.id
        //删除数组里面的值
        that.data.fileList.splice(inde, 1)
        that.setData({
            fileList: that.data.fileList,
        })
    },
    //获取用户输入的标题
    titleInput(e) {
        let that = this;
        console.log("标题",e.detail)
        that.setData({
            title: e.detail,
        })
    },
    
    //获取用户输入的联系方式
    concatInput(e) {
        let that = this;
        console.log("联系方式",e.detail)
        that.setData({
            phone: e.detail,
        })
    },
    //获取用户输入的闲置物品相关内容
    noteInput(e) {
        let that = this;
        console.log("物品说明",e.detail.cursor)
        that.setData({
            note_counts: e.detail.cursor,
            notes: e.detail.value,
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