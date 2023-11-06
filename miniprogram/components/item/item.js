// components/item/item.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        item: {
            title:String,
            avatarUrl:String,
            nickName:String,
            creat:Number,
            notes:String,
            fileList:Array
        },
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        onTap() {
            let that = this;
            that.triggerEvent('customevent', {data : that.data.item}) 
          },
    }
})
