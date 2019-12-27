
cc.Class({
    extends: cc.Component,

    properties: {
 
        winbg:cc.Node,
        loserbg:cc.Node,
        scoreNumLabel:cc.Label,
        _scoreNum: 0,
        isWin:false,
        scoreNum: {
            set(scoreNum) {
                if (scoreNum === this._scoreNum) return;
                this._scoreNum = scoreNum;
                if (scoreNum === 0) {
                    this.scoreNumLabel.string = '';                  
                } else {
                    this.scoreNumLabel.string = scoreNum + '';
                    if(this.isWin){
                      this.refershOverBg()
                    }
                }  
            },

            get() {
                return this._scoreNum;
            }
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
        this.winbg.active = false;
        this.loserbg.active = true;
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            event.stopPropagationImmediate();
        });
    },

    onBtnRetry() {
        cc.director.loadScene('game');
    },

    refershOverBg(){
        var self=this;
        this.scheduleOnce(function(){
            this.winbg.active = true;
            this.loserbg.active = false;
        },0);
       
        // this.loserbg.active = true;
    },
    // update (dt) {},
});
