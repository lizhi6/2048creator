/*
 * @Copyright: Copyright (c) 2019
 * @Author: 一枚小工
 * @Version: 1.0
 * @Date: 2019-10-24 16:11:26
 */

cc.Class({
    extends: cc.Component,
	extends: cc.Component,
 
    properties: {
        x: 0,
        y: 0,
        texture: {
        	default: null,
        	type: cc.Texture2D
    	},
        spriteFrame: {
        	default: null,
        	type: cc.SpriteFrame
        },
        _typeNum: 0,
        typeNum: {
            set(typeNum) {
                if (typeNum === this._typeNum) return;
                this._typeNum = typeNum;
                this.changBg();      
            },
            get() {
                return this._typeNum;
            }
        },
        _number: 0,
        number: {
            set(number) {
                if (number === this._number) return;
                this._number = number;
                if (number === 0) {
                    this.numberLabel.string = ''; 
                              
                } else {
                    this.numberLabel.string = number + '';
                }
                this.refershBg();      
            },
            get() {
                return this._number;
            }
        },
        numberLabel: cc.Label,
        bgImg:cc.Sprite,
        rangeX:10,
        rangeY:300,
    },

    // use this for initialization
    onLoad: function () {

    },

    init(x, y, n) {
        this.x = x;
        this.y = y;
        this.number = n;
        this.rangeX = 180*x + 10;
        this.rangeY = 300 + 180*y;
    },
    refershBg() {
        
        var foldPath ="res1"
        if(this.typeNum>=0 && this.typeNum <= 4 ){
            foldPath ="res"+this.typeNum;
        }
        var spath=foldPath+"/"+this.number+".png";
        if(this.number == 0 ){
            spath="res0/"+this.number+".png";
        }
        this.bgImg.spriteFrame = new cc.SpriteFrame(spath);  
        this.numberLabel.node.color = new cc.color(255,0,0,255); 

        // this.numberLabel.node.color = new cc.color(79,78,92,255); 
        // if(this.number>=32){
            
        // }
        
    },
    changBg(){
        var foldPath ="res1"
        if(this.typeNum>=0 && this.typeNum <= 4 ){
            foldPath ="res"+this.typeNum;
        }
        var spath=foldPath+"/"+this.number+".png";
        if(this.number == 0 ){
            spath="res0/"+this.number+".png";
        }
        this.bgImg.spriteFrame = new cc.SpriteFrame(spath);  
        this.numberLabel.node.color = new cc.color(255,0,0,255); 
    },
    randomNumber() {
        this.number = 2;
        let n = Math.ceil(Math.random() * 10);
        if(n <= 6) {
            this.number = 4;
        }else {
            this.number = 2;
        }
 
    },
    isInTile(x,y){
       if(x>this.rangeX && x<this.rangeX+150 && y>this.rangeY &&y<this.rangeY+150){
         return true;
       }
       return false;
    }
});