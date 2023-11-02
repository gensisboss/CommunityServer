// pages/search/search.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputValue:'', //输入框value值
        noData:false, //暂无数据
        carList:[],//搜索列表
        history:false, //搜索记录
        historyData:[], //历史记录列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var that = this
        wx.getStorage({ //获取历史记录缓存
          key: 'history', 
          success(res) {
            console.log(res.data)
            if(res.data == ''){
              that.setData({
                history:false
              })
            }else{
              that.setData({
                historyData: res.data,
                history:true
              })
            }
          }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    onSearch(e){
        var that = this
        if (e.detail.value == ''){ //输入框value为空
          that.setData({
            noData:false,
            carList:'',
            closeImg:false,
            history:true
          })
        }else{ //输入框value不为空
          that.setData({
            closeImg: true,
            history:false
          })
          $http.post('my/search_vehicles',{ //请求搜索接口
            search: e.detail.value
          }).then(res=>{
            var resObj = res.data
            if(resObj.code == 1){
              //请求成功
              console.log(resObj.data)
              if (resObj.data){
                that.setData({
                  noData: false,
                  carList: resObj.data.brandList
                })
              }else{
                that.setData({
                  noData:true
                })
              }
            }else{
              console.log('请求失败',resObj.msg)
            }
          }).catch(err=>{
            console.log('异常回调',err)
          })
        }
    },

    onCancel(){
        var that = this
        wx.switchTab({
          url: '/pages/square/square'
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})