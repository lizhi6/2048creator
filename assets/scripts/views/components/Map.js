/*
 * @Copyright: Copyright (c) 2019
 * @Author: 一枚小工
 * @Version: 1.0
 * @Date: 2019-10-24 16:11:26
 */
cc.Class({
    extends: cc.Component,

    properties: {
        tilePrefab: cc.Prefab,
        tileLayer: cc.Node,
        scoreLable:cc.Label,
        hisScoreLable:cc.Label,//历史分数
        overNodePerfab:cc.Prefab,
        overLayer: cc.Node, 
        onChuiZi: cc.Node,

        headImg:cc.Node,
        nickName:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
    
        cc.map = this;
        cc.log("=======   cc.log(cc.vv.userMgr)==========");
        cc.log(cc.vv.userMgr);
        console.log("===cc.vv.userMgr.userInfo");
        console.log(cc.vv.userMgr.userInfo);
       
        var openUserMsg = require("openUiData");
        this.openUserMsg  = new openUserMsg();

        this.setMyselfInfo(cc.vv.userMgr.userInfo);
        ///总分数
        this.scoreAll = 0;
        ////是不是点击了锤子
        this.isOnChuiZi = false;
        cc.sys.localStorage.setItem("CZNUM",3);
        var cznum = cc.sys.localStorage.getItem("CZNUM");
        this.chuziNum = cznum;
        if(cznum==null){
            this.chuziNum = 0;
        }
       
        this.onChuiZi.getChildByName("Label").getComponent(cc.Label).string ="x"+this.chuziNum

        // this.onChuiZi.getComponent(cc.Label).string="x0"
        var topscore = cc.sys.localStorage.getItem("topScore");
        this.scoreAllTop = topscore;
        if(topscore==null){
           this.scoreAllTop = 0;
        }
        this.hisScoreLable.string = "最高分："+this.scoreAllTop

        this.isGameOverNum = false;//如果四边都不能滑动了则游戏结束
        this.mapWidth = this.node.width;
        this.tileWidth = this.mapWidth / 4;
        this.g = this.getComponent(cc.Graphics);
        this.touchStartPosition = cc.v2();
        this.touchEndPosition = cc.v2();
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            this.touchStartPosition = event.getLocation();
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            // cc.log("========移动===========")
            // cc.log(event)
        });
        this.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            this.touchEndPosition = event.getLocation();
        
            ///先判断锤子
            if(this.isOnChuiZi){
                this.isOnChuiZi = false
                for (let x = 0; x < 4; x++) {
                    for (let y = 0; y < 4; y++) {          
                        // this.tiles[x][y].typeNum = customEventData ;
                        if(this.tiles[x][y].isInTile(this.touchEndPosition.x,this.touchEndPosition.y)&& this.tiles[x][y].number != 0){
                          
                           this.chuziNum = this.chuziNum -1;
                           cc.sys.localStorage.setItem("CZNUM",this.chuziNum);
                           this.onChuiZi.getChildByName("Label").getComponent(cc.Label).string="x"+this.chuziNum
                           this.tiles[x][y].number = 0;
                           cc.audioEngine.play(cc.url.raw("resources/sound/btnclick.mp3"),false,0.5);
                           cc.log(x,"===========消除了=======",y)
                           return;
                        }
                    }
                }  
            }



            let offsetX = this.touchEndPosition.x - this.touchStartPosition.x;
            let offsetY = this.touchEndPosition.y - this.touchStartPosition.y;
            this.isGameOverNum = true;
            let num = 0;
            if (Math.abs(offsetX) > Math.abs(offsetY)) {
                if (offsetX > 5) {
                    this.onRightSlide();
                    cc.log('right');
                    num = 1;
                } else if (offsetX < -5) {
                    this.onLeftSlide();
                    cc.log('left');
                    num = 1;
                } 
                cc.audioEngine.play(cc.url.raw("resources/sound/btnclick.mp3"),false,0.5);
            } else {
                if (offsetY > 5) {
                    this.onUpSlide();
                    cc.log('up');
                    num = 1;
                } else if (offsetY < -5) {
                    this.onDownSlide();
                    cc.log('down');
                    num = 1;
                }
                cc.audioEngine.play(cc.url.raw("resources/sound/btnclick.mp3"),false,0.5);
            }
            if(this.isGameOverNum && num != 0){
                this.initOverNode()
            }
        });
    
        this.drawBg();
        // this.initTiles();
        // this.drawBg();
        this.initTiles();

        this.mergeArray([0,0,2,8]);

        
        // 初始化背景
        var titleBgIndex = cc.sys.localStorage.getItem("titleBgIndex");
        if(titleBgIndex==null){
            titleBgIndex = 0;
        }
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {          
                this.tiles[x][y].typeNum=titleBgIndex;
            }
        }
    },

    /**
     * @description: 合并arr
     * @param {array} arr
     * @return: 
     */
    mergeArray(arr){
        if(arr.length <= 0){
            return;
        }

        // cc.log('#1', arr);

        // 按照顺序取出非0值
        let src = [];
        for(let i = 0; i < arr.length; i++){
            if(arr[i] != 0){
                src.push(arr[i]);
            }
        }        

        // 模拟栈
        let stack = [];
        let isfist=true;
        while(src.length > 0){
            // 栈是空或栈顶元素和源数据最后一个不一样
            if(stack.length <= 0 || stack[0] != src[src.length - 1]||!isfist){
                stack.unshift(src[src.length-1]);
                src.splice(src.length -1, 1);
            }
            // 栈顶出栈
            else{
                isfist=false;
                src[src.length-1] = src[src.length-1] * 2;
                this.scoreAll = this.scoreAll + src[src.length-1]/2
                stack.splice(0, 1);
                // break;
            }
        }
        // cc.log('#2', stack);
        this.scoreLable.string = this.scoreAll+''
       
        // if(this.scoreAll!=0 && this.scoreAll%10==0 && this.chuziNum <10 ){
        //     cc.log("==this.chuziNum锤子加一====",this.chuziNum);
        //     this.chuziNum++;
        //     this.onChuiZi.getChildByName("Label").getComponent(cc.Label).string="x"+this.chuziNum

        //     cc.sys.localStorage.setItem("CZNUM",this.chuziNum);
        // }

        if(this.scoreAllTop < this.scoreAll){
            this.scoreAllTop = this.scoreAll;
            this.hisScoreLable.string = "最高分："+this.scoreAllTop;
            cc.sys.localStorage.setItem("topScore",this.scoreAll);
            //提交最高分数
            this.openUserMsg.submitScoreButtonFunc(this.scoreAllTop)        
        }
        return stack;
    },

    onLeftSlide() {
        // 判断是否有tile移动
        let isMove = false; 

        for (let y = 0; y < 4; y++) {
            let src = [];
            for(let x = 3; x >= 0; x--){
                src.push(this.tiles[x][y].number);
            }
            let stack = this.mergeArray(src);

            // 有变化
            if(stack.length != src.length){
                for(let x = 0; x < 4; x++){
                    if(stack.length > 0){
                        this.tiles[x][y].number = stack[stack.length - 1];
                        stack.splice(stack.length-1, 1);
                    }
                    else{
                        this.tiles[x][y].number = 0;
                       
                    }
                }
                isMove = true;
            }
        }

        // 没变化
        if(!isMove){
            return;
        }
        
        if (isMove) {
            this.newTile();
            this.judgeOver();
        }
    },

    onRightSlide() {
        // 判断是否有tile移动
        let isMove = false; 

        for (let y = 0; y < 4; y++) {
            let src = [];
            for(let x = 0; x < 4; x++){
                src.push(this.tiles[x][y].number);
            }
            let stack = this.mergeArray(src);

            // 有变化
            if(stack.length != src.length){
                for(let x = 3; x >= 0; x--){
                    if(stack.length > 0){
                        this.tiles[x][y].number = stack[stack.length - 1];
                        stack.splice(stack.length-1, 1);
                    }
                    else{
                        this.tiles[x][y].number = 0;
 
                    }
                }
                isMove = true;
            }
        }

        // 没变化
        if(!isMove){
            return;
        }

        //有tile移动才添加新的tile
        if (isMove) {
            this.newTile();
            this.judgeOver();
        }
    },

    onDownSlide() {
        // 判断是否有tile移动
        let isMove = false; 

        for (let x = 0; x < 4; x++) {
            let src = [];
            for(let y = 3; y >= 0; y--){
                src.push(this.tiles[x][y].number);
            }
            let stack = this.mergeArray(src);

            // 有变化
            if(stack.length != src.length){
                for(let y = 0; y < 4; y++){
                    if(stack.length > 0){
                        this.tiles[x][y].number = stack[stack.length - 1];
                        stack.splice(stack.length-1, 1);
                    }
                    else{
                        this.tiles[x][y].number = 0;
 
                    }
                }
                isMove = true;
            }
        }

        // 没变化
        if(!isMove){
            return;
        }
        
        if (isMove) {
            this.newTile();
            this.judgeOver();
        } 
    },

    onUpSlide() {
        // 判断是否有tile移动
        let isMove = false; 

        for (let x = 0; x < 4; x++) {
            let src = [];
            for(let y = 0; y < 4; y++){
                src.push(this.tiles[x][y].number);
            }
            let stack = this.mergeArray(src);

            // 有变化
            if(stack.length != src.length){
                for(let y = 3; y >= 0; y--){
                    if(stack.length > 0){
                        this.tiles[x][y].number = stack[stack.length - 1];
                        stack.splice(stack.length-1, 1);
                    }
                    else{
                        this.tiles[x][y].number = 0;
         
                    }
                }
                isMove = true;
            }
        }

        // 没变化
        if(!isMove){
            return;
        }
        
        if (isMove) {
            this.newTile();
            this.judgeOver();
        }
    },

    drawBg() {
        this.g.rect(0, 0, this.node.width, this.node.height);
        this.g.fillColor = new cc.Color().fromHEX('#F5F5F4');//cc.hexToColor('#ffffff');填充颜色
        this.g.stroke();
        this.g.fill();
        this.g.strokeColor = new cc.Color().fromHEX('#F5F5F4'); //边的颜色
        this.g.lineWidth = 10;
        for (let x = 0; x < 5; x++) {
            this.g.moveTo(x * this.tileWidth, 0);
            this.g.lineTo(x * this.tileWidth, this.mapWidth);
        }
        for (let y = 0; y < 5; y++) {
            this.g.moveTo(0, y * this.tileWidth);
            this.g.lineTo(this.mapWidth, y * this.tileWidth);
        }
        this.g.stroke();
    },

    judgeOver() {
        for(let x = 0; x < 4;x++){
            for(let y = 0; y < 4; y++) {
                if(this.tiles[x][y].number === 2048) {     
                    this.initOverNode(true)       
                }
            }
        }
    },
    initOverNode(iswin){
        let overNode = cc.instantiate(this.overNodePerfab);
        this.overLayer.addChild(overNode);
        let overNodeSp =  overNode.getComponent('overLayerjs');
        if(iswin){
            overNodeSp.isWin =true;
        }
        overNodeSp.scoreNum =this.scoreAll;
    },
    initTiles(tileWidth) {
        this.tileLayer.removeAllChildren();
        this.tiles = [];
        this.zeroTiles = [];

        for (let x = 0; x < 4; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < 4; y++) {
                let tileNode = cc.instantiate(this.tilePrefab);
                this.tileLayer.addChild(tileNode);
                tileNode.x = x * this.tileWidth + this.tileWidth / 2;
                tileNode.y = y * this.tileWidth + this.tileWidth / 2;
                let tile = tileNode.getComponent('Tile');
                tile.init(x, y, 0);
                this.tiles[x][y] = tile;
                cc.log(x,"===",y)
                cc.log(tileNode.x,"=ssss==",tileNode.y)
                this.zeroTiles.push(tile);

            }
        }
        for (let i = 0; i < 2; i++) {
            this.newTile();
        }


  
    },

    newTile() {
    
        this.isGameOverNum = false;
        this.zeroTiles = [];
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                if (this.tiles[x][y].number === 0) {
                    this.zeroTiles.push(this.tiles[x][y]);
                   
                }
            }
        }
        let n = Math.floor(Math.random() * this.zeroTiles.length);
        this.zeroTiles[n].randomNumber();
        // this.zeroTiles[n].getComponent('Tile').randomNumber();
        this.zeroTiles.splice(n, 1);
    },

    onBtnRetry() {
        cc.director.loadScene('game');
    },

    onBtnSleep() {
        cc.director.loadScene('sleep');
    },
    onBtnChangPf(event, customEventData){
        cc.sys.localStorage.setItem("titleBgIndex",customEventData);
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {          
                this.tiles[x][y].typeNum = customEventData ;
            }
        }
    },
    ///锤子数量
    onChuziNum(){
        if(this.chuziNum>0){
            this.isOnChuiZi = true;
        }
    },
    setMyselfInfo:function(info){
        if(info){
            this.nickName.string = info.nickName;
            this.showHead(info.avatarUrl);
        }
    },
    showHead:function(headUrl){
        var self = this;
        if (headUrl && headUrl.length>20) {
            cc.loader.load({url: headUrl, type: 'jpg'}, (function(err, texture) {
                if (err) {
                    console.log(err);
                }else{
                    var spr = new cc.SpriteFrame();
                    spr.setTexture(texture);
                    self.headImg.getComponent(cc.Sprite).spriteFrame = spr;
                }
            }));
        }else{
            //this.headImg.getComponent(cc.Sprite).spriteFrame = this.manHeadAss;
        }
    },
    ///分享游戏
    onBtnShareClick:function(){
        // 分享要传递的参数   
        if(cc.sys.platform != cc.sys.WECHAT_GAME){
            return 
        }
        var nick = cc.vv.userMgr.userInfo.nickName;
        var gender = "女";
        var city = "北京";
        var self = this;
        //分享要显示图片
        var shareImgUrl = "https://game.xceshi.top/shareImg/2048.png";
        wx.shareAppMessage()
        ({
          title: "我需要你的帮助,赶紧一起来玩吧~",      //分享标题
          imageUrl: shareImgUrl,
          query: "nick=" + nick + "&gender=" + gender + "&city=" + city, // 别人点击链接时会得到的数据
          success: function success(res) {
            cc.log("分享成功");
            console.log("分享成功", res);
            wx.showShareMenu({
                // 要求小程序返回分享目标信息
                withShareTicket: true 
            });

            wx.getShareInfo({
                shareTicket: res.shareTickets[0],
                success:function success(res){
                  console.log('--- 信息 ---', res);
                  console.log('--- 错误信息 ---', res.errMsg);
                  console.log('--- 包括敏感数据在内的完整转发信息的加密数据 ---', res.encryptedData);
                  console.log('--- 错误信息 ---', res.iv);        
            }});

          },
          fail: function fail(res) {
               cc.log("分享失败");
               console.log("分享失败", res);
          }
        });
    },

});