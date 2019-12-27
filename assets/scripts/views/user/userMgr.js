
cc.Class({

    properties: {
    //     id:null,//用户ID
    //     userUnionid : "",  //用户Unionid
	//     sex:1,//性别1男2女
	// 	nickname:null,//昵称
    //     fangka8:0,//银元宝
    //     fangka16:0,//金元宝
	// 	headimgurl:"",//头像url
	// 	money:0,//金币
	// 	usertoken:0,//用户token,用来在其他服务器验证
    //     ip:"",//ip
    //     address:"",
    //     score:0,
    //     seatid:null,
    //     roomData:null,
    //     oldRoomId:null,
    //     MjType:0,
    //     pai:0,
    //     shareUrl: "http://h5.99thj.com/h5zz/",
    //     //shareUrl: "http://ht.66thj.com/h5zz/index.html",
    //     iconUrl:"http://h5.99thj.com/texture/icon.png",
    //    // niu_list:false,
    //    isFirstGame:true,
    //    guildId:null,
        shareUrl: "http://h5.99thj.com/h5game/index/index.php",
        iconUrl:"http://h5.99thj.com/sharetx/share.jpg",
        longitude:0,
        latitude:0,
    },

 
    init:function(){
        this.baseinfo = {
            id:0,
            money:0,
            fangka8:0,
            fangka16:0,
            nickname:"",
            usertoken:"",
            headimgurl:"",
            sex:null,
        };
        
        this.isCreater = false; // 只用于判断显示解散、离开大厅
        this.warHisItems = null;

        this.autoEnterRoomId = 0;
        this.autoEnterGuildId = 0;

        this.hasIDCard = false; // 身份证认证
        this.hasPhone = false;  // 手机认证
        this.myIpStr = "";
    },


    guestAuth:function(logintype,_name,_password,_headimgurl,_sex,_openid,_province,_city,unionid,token){
        var self = this;
        self.userUnionid = _password;
        var data = {
            loginType : 0,
            name : cc.vv.crypto.encodeName(_name),
            password : _password,
            headimgurl : _headimgurl,
            sex :_sex,
            province : _province,
            city : _city,
            unionid : unionid,
            accessToken : "333333",
            openid : _openid,
        }; 

        cc.vv.net.send(cc.vv.CG_LOGIN,data);
    },

    loginByToken:function(token){
        var data = {
            m_Token : token,
        }; 
        cc.vv.net.send(cc.vv.CG_TOKEN_LOGIN,data);
    },




});
