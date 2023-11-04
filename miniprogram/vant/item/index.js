import { link } from '../mixins/link';
import { VantComponent } from '../common/component';
VantComponent({

  mixins: [link],
  props: {
    item: {
        title:String,
        avatarUrl:String,
        nickName:String,
        creat:Number,
        notes:String,
        fileList:Array
    },
  },
  methods: {
    onTap(event) {
      this.triggerEvent('customevent', {}) 
    },
  },
});
