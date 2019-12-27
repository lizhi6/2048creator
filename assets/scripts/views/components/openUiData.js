cc.Class({
    extends: cc.Component,
    // name: "RankingView",
    properties: {
        wxSubContextView: cc.Node,
        groupFriendButton: cc.Node,
        friendButton: cc.Node,
        gameOverButton: cc.Node,

        closeButton:cc.Node,
        rankingScrollView: cc.Sprite,//显示排行榜
    },
    onLoad() {

        this.initAction();
    },
 
    initAction () {
        this.wxSubContextView.active=false;
        this._isShow = false;
        this.closeButton.active = false ;
        this.wxSubContextView.y = 0;
        this._showAction = cc.moveTo(0.5, this.wxSubContextView.x, 0);
        this._hideAction = cc.moveTo(0.5, this.wxSubContextView.x, 1280);

 
        this.wxSubContextView.on(cc.Node.EventType.TOUCH_END, function (event) {
            event.stopPropagationImmediate();
          });
 
    },

    // onClick (event) {
    //     this._isShow = !this._isShow;
    //     if (this._isShow) {
    //          this.wxSubContextView.active=true;
    //          this.closeButton.active = true ;
    //          this.wxSubContextView.runAction(this._showAction);         
    //     }
    //     else {
    //         this.wxSubContextView.active=false;
    //         this.closeButton.active = false ;
    //         this.wxSubContextView.runAction(this._hideAction);
    //     }
    // },
    showActionLayer(){
        this.wxSubContextView.active=true;
        this.closeButton.active = true ;
        this.wxSubContextView.runAction(this._showAction);  
    },
    hideActionLayer(){
        this.wxSubContextView.active=false;
        this.closeButton.active = false ;
        this.wxSubContextView.runAction(this._hideAction);
    },
    
    start() {
        if (CC_WECHATGAME) {
            window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "x1"
            });
        }
    },   
    friendButtonFunc(event) {
        this.showActionLayer()
        if (CC_WECHATGAME) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "x1"
            });
    
        } else {
            cc.log("获取好友排行榜数据。x1");
        }
 
    },

    groupFriendButtonFunc: function (event) {
        var self =this;
        this.showActionLayer()
        if (CC_WECHATGAME) {
            window.wx.shareAppMessage({
                success: (res) => {          
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        window.wx.postMessage({
                            messageType: 5,
                            MAIN_MENU_NUM: "x1",
                            shareTicket: res.shareTickets[0]
                        });
                    }
                }
            });
        } else {
            cc.log("获取群排行榜数据。x1");
        }
    },

    gameOverButtonFunc: function (event) {
        if (CC_WECHATGAME) {
            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: "x1"
            });
        } else {
            cc.log("获取横向展示排行榜数据。x1");
        }
    },

    submitScoreButtonFunc(scoreNum){
        let score = 0;
        score=scoreNum;
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "x1",
                score: score,
            });
        } else {
            cc.log("提交得分: x1 : " + score)
        }
    },
    closeButtonFunc(){

    },
});
