// components/comment/comment.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 可以在组件使用时指定的属性
        comment: {
            openid : String,
            nickName:String,
            avatarUrl:String,
            time:Number,
            content:String,
            subComment:Array
        },
        index:Number,
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 组件内部数据
        replyComment: null,
        isMy :false
    },

    
    lifetimes:{
        attached(){
            const app = getApp();
            let that = this;
            that.setData({
                isMy : that.properties.comment.openid == app.globalData.openid
            })
         },
        detached(){ },
     },

    /**
     * 组件的方法列表
     */
    methods: {
        delete: function (event) {
            let that = this;
            that.triggerEvent('customevent', {
                index : that.properties.index
            });
        }
    }
})