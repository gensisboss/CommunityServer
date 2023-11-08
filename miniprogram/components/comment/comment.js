// components/comment/comment.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 可以在组件使用时指定的属性
        comment: {
            nickName:String,
            avatarUrl:String,
            time:Number,
            content:String,
            subComment:Array
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 组件内部数据
        replyComment: null
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 自定义方法
        replyComment: function (event) {
            const commentId = event.currentTarget.dataset.commentId;
            this.setData({
                replyComment: commentId
            });
            // 实现自定义事件的触发
            this.triggerEvent('reply', {
                commentId
            });
        }
    }
})