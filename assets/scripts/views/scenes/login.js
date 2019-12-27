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

    // onLoad () {},

    start () {
            if (!cc.vv) {
                cc.vv = {};
            }

            var UserMgr = require("../user/userMgr");
            cc.vv.userMgr = new UserMgr();
            cc.vv.userMgr.init();
 
            // this.startGame();

    },

    startGame:function(){
        var self = this;

        self.onWxGameAutoGameLogin();

        // cc.vv.net.connect(function(){
        //     // cc.vv.log("连接成功");
        //     if (cc.vv.enum.exportPlatForm == cc.vv.enum.PlatForm_WXWeb) {
        //         self.onWxWebAutoGameLogin();
        //     }else if (cc.vv.enum.exportPlatForm == cc.vv.enum.PlatForm_WXGame){
        //         self.onWxGameAutoGameLogin();
        //     }else if (cc.vv.enum.exportPlatForm == cc.vv.enum.PlatForm_Win || cc.vv.enum.exportPlatForm == cc.vv.enum.PlatForm_newApp){
        //         cc.vv.sceneMgr.showPromptWnd(cc.vv.enum.PromptWndType.Hide);
        //     }

        // });
    },
    onWxGameAutoGameLogin:function(){
        wx.login({
            success: function (data) {
                self.wxCode = data.code;
                wx.getUserInfo({
                    fail: function (res) {
                        if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1 ) {
                            // 处理用户拒绝授权的情况
                            // cc.vv.sceneMgr.showPromptWnd(cc.vv.enum.PromptWndType.OutClick | cc.vv.enum.PromptWndType.YesBtn,"请开启用户权限:右上角菜单->关于转转麻将->右上角菜单->设置->开启允许使用我的信息");
                        }
                    },
                    success: function(res) {
                        //this.isWxLogin = false;
                        self.getToken2(self.wxCode,res);
                    },
                });
            },
            fail:function(data){
                //console.log("pre wx.login fail");
            }
        });
    },
    //////拉起用户授权的界面
    hikeUserInfo:function(){
        if(cc.sys.platform != cc.sys.WECHAT_GAME){
              cc.director.loadScene('loading');
              return 
        }
        let exportJson = {};
        let sysInfo = wx.getSystemInfoSync();
        //获取微信界面大小
        let width = sysInfo.screenWidth;
        let height = sysInfo.screenHeight;
        wx.getSetting({
                success (res) {
                    console.log(res.authSetting);
                    if (res.authSetting["scope.userInfo"]) {
                        console.log("用户已授权");
                        wx.getUserInfo({
                            success(res){
                                console.log(res);
                                exportJson.userInfo = res.userInfo;

                                console.log("用户信息:", exportJson);
                                console.log(exportJson.userInfo);        
                                cc.vv.userMgr.userInfo = exportJson.userInfo;

                                cc.director.loadScene('loading');
                                //此时可进行登录操作
                            }
                        });
                    }else {
                            console.log("用户未授权");
                            let button = wx.createUserInfoButton({
                                type: 'text',
                                text: '',
                                style: {
                                    left: 0,
                                    top: 0,
                                    width: width,
                                    height: height,
                                    backgroundColor: '#00000000',//最后两位为透明度
                                    color: '#ffffff',
                                    fontSize: 20,
                                    textAlign: "center",
                                    lineHeight: height,
                                }
                            });
                            button.onTap((res) => {
                                if (res.userInfo) {
                                    console.log("用户授权:", res);
                                    exportJson.userInfo = res.userInfo;

                                    console.log("用户信息:", exportJson);
                                    console.log(exportJson.userInfo);        
                                    cc.vv.userMgr.userInfo = exportJson.userInfo;
                                    
                                    cc.director.loadScene('loading');
                                    //此时可进行登录操作
                                    button.destroy();
                                }else {
                                    console.log("用户拒绝授权:", res);
                                }
                            });
                        }
                    }
                })

        // cc.vv.userMgr.exportJson = exportJson; 
    },  
    onAutoGameLogin:function(){
        
    },

    getToken2:function(codeStr,res){
        var self = this;
        var param = {
            url:self.getTokenUrl,
            args:{
                js_code : codeStr,
                app_id : self.appIDCode,
            },
            callback:function(event,info){
                info = info.data;
                cc.vv.wxCrypt.init(self.appIDStr,info.session_key);
                var decrydata = cc.vv.wxCrypt.decryptData(res.encryptedData,res.iv);

                cc.vv.userMgr.baseinfo.headimgurl = res.userInfo.avatarUrl;
                cc.vv.userMgr._name = res.userInfo.nickName;
                cc.vv.userMgr._password = decrydata.openId;
                cc.vv.userMgr._headimgurl = res.userInfo.avatarUrl;
                cc.vv.userMgr._sex = res.userInfo.gender;
                cc.vv.userMgr._openid =decrydata.openId;
                cc.vv.userMgr._province = res.userInfo.province;
                cc.vv.userMgr._city = res.userInfo.city;
                cc.vv.userMgr.unionid = decrydata.unionId;
                cc.vv.userMgr.baseinfo.headimgurl = cc.vv.userMgr._headimgurl;
                cc.vv.userMgr.guestAuth(0,  res.userInfo.nickName, decrydata.openId , res.userInfo.avatarUrl,res.userInfo.gender,decrydata.openId,res.userInfo.province,res.userInfo.city ,decrydata.unionId,"");
                
            },
        };

        // cc.vv.http.get(param);
    },

    // onLoginBtnClick:function(){
    onLoginBtnClick:function(){
        var self = this;

        // cc.vv.util.webCopyString("复制你个头");
        // return ;
        this.startGame();

        // if (cc.vv.enum.exportPlatForm == cc.vv.enum.PlatForm_WXWeb) {
        //     if (cc.vv.net && !cc.vv.net.connected) {
        //         this.startGame();
        //     }            
        // }else if (cc.vv.enum.exportPlatForm == cc.vv.enum.PlatForm_WXGame){
           
        // }else if (cc.vv.enum.exportPlatForm == cc.vv.enum.PlatForm_Win || cc.vv.enum.exportPlatForm == cc.vv.enum.PlatForm_newApp){

        //     // 用户名密码登录
        //     var name = this.accLabel.string;
        //     cc.vv.userMgr.nickname = this.accLabel.string;

        //     var password = this.accLabel.string;

        //     if(name == "" || password == ""){
        //         var num = Math.floor(Math.random()*9000+1000);
        //         name = num.toString();
        //         password = num.toString();
        //     }

        //     if(!this.checkXieyi.isChecked){
        //         cc.vv.sceneMgr.showPromptWnd(cc.vv.enum.PromptWndType.OutClick | cc.vv.enum.PromptWndType.YesBtn,"请同意用户协议");
        //     }else{
        //         // cc.sys.localStorage.setItem("user_name",name);
        //         cc.vv.sceneMgr.showPromptWnd(cc.vv.enum.PromptWndType.NoBtn,"正在登陆..."); 

        //         cc.vv.userMgr.guestAuth(0,name, password , "" , 1 , "_openid" , "_province" , "_city" , "unionid","");
                
        //     }
        // }

    },
    // update (dt) {},
});
