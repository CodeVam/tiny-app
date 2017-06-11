//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    wx.onBackgroundAudioPause(() =>{
      clearInterval(this.globalData.player_info.timer)
    })
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    reference1: "http://music.163.com/api",
    reference2: "http://s.music.163.com",
    apis: {
      getSearchList: "/search/get/",
      getSongInfo: "/song/detail/",
      // getSongUrl: "/song/enhance/download/url"
    },
    querys: {
      getSearchList: {
        type: 1,
        limit: 50,
        offset: 0,
        s: ''
      },
      getSongInfo: {
        id: "",
        ids: ""
      },
      // getSongUrl: {
      //   id: 0,
      //   br: 0
      // }
    },
    queryTool: function (obj) {
      let query = "";
      for(let prop in obj) {
        query = query + "&" + prop + "=" + obj[prop];
      }
      return "?" + query.substr(1);
    },
    player_info:{
      playing: false,
      playingUrl: "",
      file_duration: '00:00',
      progress_time: "00:00",
      progress_value: 0,
      count: 1,
      duration: 0,
      songUrl: "",
      picUrl: "",
      name: "",
      timer: null
    }
  }
})