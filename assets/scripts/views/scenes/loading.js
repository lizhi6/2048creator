// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.loadLabel = this.node.getChildByName("loadingBar").getComponent(cc.Label);
        // cc.loader.loadResDir('', (err, data)=>{ // 注意,这里的prefab/stageitem的根目录是assets/resource
        //     if (err) {
        //         console.error('cc.loader.loadRes prefab/stageitem ' + err.message);
        //         return;
        //     }
 
        // });
        cc.director.preloadScene("game", this.onProgress.bind(this), function(){    
            cc.log("加载成功");
        })

    },

    onProgress:function(completedCount, totalCount, item) {
        this.loading=this.node.getChildByName("loadingBar");
        this.loading.progress = completedCount/totalCount;
        this.loadLabel = this.node.getChildByName("loadingBar").getComponent(cc.Label);
        this.loadLabel.string = Math.floor(completedCount/totalCount * 100) + "%";
    },

    start () {

    },
 
    // update (dt) {},
});
