// pages/index/index.js
const app = getApp();
const db = wx.cloud.database();

const defaultLogName = {
    work: '工作',
    rest: '休息'
}
const actionName = {
    stop: '停止',
    start: '开始'
}

const initDeg = {
    left: 45,
    right: -45,
}


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
        online: false,

        // 测试数据
        remainTimeText: '',
        timerType: 'work',
        log: {},
        completed: false,
        isRuning: false,
        leftDeg: initDeg.left,
        rightDeg: initDeg.right

    },


    formatTime: function (time, format) {
        let temp = '0000000000' + time
        let len = format.length
        return temp.substr(-len)
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
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
                    online: res.data[0].online2
                })
                console.log("当前通知信息", res)
                app.globalData.online = res.data[0].online2
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

    showOfficial: function (event) {
        app.globalData.officialChanngel = event.currentTarget.dataset.id;
        console.log("通告数据", app.globalData.officialChanngel)
        wx.navigateTo({
            url: "/pages/official/official",
        })
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
        if (this.data.isRuning) return
        let workTime = this.formatTime(wx.getStorageSync('workTime'), 'HH')
        let restTime = this.formatTime(wx.getStorageSync('restTime'), 'HH')
        this.setData({
            workTime: workTime,
            restTime: restTime,
            remainTimeText: workTime + ':00'
        })
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

    },

    startTimer: function (e) {
        let startTime = Date.now()
        let isRuning = this.data.isRuning
        let timerType = e.target.dataset.type
        let showTime = this.data[timerType + 'Time']
        let keepTime = showTime * 60 * 1000
        let logName = this.logName || defaultLogName[timerType]

        if (!isRuning) {
            this.timer = setInterval((function () {
                this.updateTimer()
                this.startNameAnimation()
            }).bind(this), 1000)
        } else {
            this.stopTimer()
        }

        this.setData({
            isRuning: !isRuning,
            completed: false,
            timerType: timerType,
            remainTimeText: showTime + ':00',
            taskName: logName
        })

        this.data.log = {
            name: logName,
            startTime: Date.now(),
            keepTime: keepTime,
            endTime: keepTime + startTime,
            action: actionName[isRuning ? 'stop' : 'start'],
            type: timerType
        }

        this.saveLog(this.data.log)
    },

    startNameAnimation: function () {
        let animation = wx.createAnimation({
            duration: 450
        })
        animation.opacity(0.2).step()
        animation.opacity(1).step()
        this.setData({
            nameAnimation: animation.export()
        })
    },

    stopTimer: function () {
        // reset circle progress
        this.setData({
            leftDeg: initDeg.left,
            rightDeg: initDeg.right
        })

        // clear timer
        this.timer && clearInterval(this.timer)
    },

    updateTimer: function () {
        let log = this.data.log
        let now = Date.now()
        let remainingTime = Math.round((log.endTime - now) / 1000)
        let H = this.formatTime(Math.floor(remainingTime / (60 * 60)) % 24, 'HH')
        let M = this.formatTime(Math.floor(remainingTime / (60)) % 60, 'MM')
        let S = this.formatTime(Math.floor(remainingTime) % 60, 'SS')
        let halfTime

        // update text
        if (remainingTime > 0) {
            let remainTimeText = (H === "00" ? "" : (H + ":")) + M + ":" + S
            this.setData({
                remainTimeText: remainTimeText
            })
        } else if (remainingTime == 0) {
            this.setData({
                completed: true
            })
            this.stopTimer()
            return
        }

        // update circle progress
        halfTime = log.keepTime / 2
        if ((remainingTime * 1000) > halfTime) {
            this.setData({
                leftDeg: initDeg.left - (180 * (now - log.startTime) / halfTime)
            })
        } else {
            this.setData({
                leftDeg: -135
            })
            this.setData({
                rightDeg: initDeg.right - (180 * (now - (log.startTime + halfTime)) / halfTime)
            })
        }
    },

    changeLogName: function (e) {
        this.logName = e.detail.value
    },

    saveLog: function (log) {
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(log)
        wx.setStorageSync('logs', logs)
    }
})