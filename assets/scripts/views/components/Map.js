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
    },

    // use this for initialization
    onLoad: function () {

        cc.map = this;
        ///总分数
        this.scoreAll = 0;
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
            let offsetX = this.touchEndPosition.x - this.touchStartPosition.x;
            let offsetY = this.touchEndPosition.y - this.touchStartPosition.y;
            if (Math.abs(offsetX) > Math.abs(offsetY)) {
                if (offsetX > 5) {
                    this.onRightSlide();
                    cc.log('right');
                } else if (offsetX < -5) {
                    this.onLeftSlide();
                    cc.log('left');
                }
            } else {
                if (offsetY > 5) {
                    this.onUpSlide();
                    cc.log('up');
                } else if (offsetY < -5) {
                    this.onDownSlide();
                    cc.log('down');
                }
            }
        });
      
        cc.loader.loadResDir('', (err, data)=>{ // 注意,这里的prefab/stageitem的根目录是assets/resource
            if (err) {
                console.error('cc.loader.loadRes prefab/stageitem ' + err.message);
                return;
            }
            this.drawBg();
            this.initTiles();
        });
        this.drawBg();
        this.initTiles();

        this.mergeArray([0,0,2,8]);
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

        cc.log('#1', arr);

        // 按照顺序取出非0值
        let src = [];
        for(let i = 0; i < arr.length; i++){
            if(arr[i] != 0){
                src.push(arr[i]);
            }
        }        

        // 模拟栈
        let stack = [];
        while(src.length > 0){
            // 栈是空或栈顶元素和源数据最后一个不一样
            if(stack.length <= 0 || stack[0] != src[src.length - 1]){
                stack.unshift(src[src.length-1]);
                src.splice(src.length -1, 1);
            }
            // 栈顶出栈
            else{
                src[src.length-1] = src[src.length-1] * 2;
                this.scoreAll = this.scoreAll + src[src.length-1]/2
            
                stack.splice(0, 1);
            }
        }
        cc.log('#2', stack);
        this.scoreLable.string = this.scoreAll+''
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
                    cc.director.loadScene('success');
                }
            }
        }
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
                this.zeroTiles.push(tile);
            }
        }
        for (let i = 0; i < 2; i++) {
            this.newTile();
        }
    },

    newTile() {
        cc.log("创建地图=============")
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
    }

});