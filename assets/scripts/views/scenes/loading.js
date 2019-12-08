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
        loading:cc.Node,
        loadLabel:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
 
        ///场景加载
        // cc.director.preloadScene("game", this.onProgress.bind(this), function(){    
        //     cc.log("加载成功");
        //     cc.director.loadScene('game');
        // })
        cc.loader.loadResDir("", this._progressCallback.bind(this), function (err, assets) {
            if (err) { 
                cc.log( "资源加载出错");
            }else{
                cc.log("加载成功");
                cc.director.loadScene('game');
            }
        });
        // cc.loader.loadResDir('', (err, data)=>{ // 注意,这里的prefab/stageitem的根目录是assets/resource
        //     if (err) {
        //         console.error('cc.loader.loadRes prefab/stageitem ' + err.message);
        //         return;
        //     }
        // });
    },

    onProgress:function(completedCount, totalCount, item) {
        // this.loading.getComponent(cc.ProgressBar).progress= completedCount/totalCount;
        // this.loadLabel.string = Math.floor(completedCount/totalCount * 100) + "%";
    },
    _progressCallback:function(completedCount, totalCount, item) {
        cc.log("资源加载") 
        cc.log(completedCount/totalCount);
        this.loading.getComponent(cc.ProgressBar).progress= completedCount/totalCount;
        this.loadLabel.string = Math.floor(completedCount/totalCount * 100) + "%";
    },
    start () {

    },
 
    // update (dt) {},
});
