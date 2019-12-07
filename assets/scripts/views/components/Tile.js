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
    },

    // use this for initialization
    onLoad: function () {

    },

    init(x, y, n) {
        this.x = x;
        this.y = y;
        this.number = n;

    },
    refershBg() {
        var s="reshzw/"+this.number+".png";
        this.bgImg.spriteFrame = new cc.SpriteFrame(s);  
        this.numberLabel.node.color = new cc.color(255,0,0,255); 

        // this.numberLabel.node.color = new cc.color(79,78,92,255); 
        // if(this.number>=32){
            
        // }
        
    },
    randomNumber() {
        this.number = 2;
        let n = Math.ceil(Math.random() * 10);
        if(n <= 3) {
            this.number = 4;
        }else {
            this.number = 2;
        }
 
    }
});