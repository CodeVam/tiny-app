// player.js
const app = getApp();
const {player_info} = app.globalData;
Page({
  data: {
    player_info,
    bitrate: {},
    songinfo: {},
  },
  onLoad: function (options) {
    const that = this;    
    const { reference1, apis, querys, queryTool } = app.globalData;
    const prevProps = Object.assign({}, this.data.player_info);
    console.log(prevProps);
    const picUrl = wx.getStorageSync('picUrl');
    const songUrl = wx.getStorageSync('songUrl');
    prevProps['picUrl'] = picUrl;
    prevProps['songUrl'] = songUrl;
    this.setData({ player_info: prevProps});
    querys.getSongInfo['id'] = options.id;
    querys.getSongInfo['ids'] = `[${options.id}]`;
    const query = queryTool(querys.getSongInfo);
    wx.getBackgroundAudioPlayerState({
      success: (res) => {
        const {
          currentPosition,
          dataUrl,
          downloadPercent,
          duration,
          status
        } = res;
        if (songUrl != dataUrl){
          requestInfo(that, query, res, prevProps, songUrl, picUrl);
        }else{
          if(status==0){
            wx.seekBackgroundAudio({
              position: currentPosition,
              success: () => {
                wx.playBackgroundAudio({
                  title: wx.getStorageSync('name'),
                  coverImgUrl: wx.getStorageSync('picUrl'),
                  dataUrl: songUrl
                })
              }
            })
          }
          let count = currentPosition;
          const timer = setInterval(() => {
            prevProps['progress_value'] = 100 * count / duration;
            prevProps['duration'] = timeFormat(duration);
            prevProps['name'] = wx.getStorageSync('name');
            prevProps['count'] = count;
            prevProps['progress_time'] = timeFormat(count);
            prevProps['timer'] = timer;
            that.setData({
              player_info: prevProps
            })
            if (count === duration){
              clearInterval(timer);
            }
            count = count + 1;
          }, 1000);
        }
      },
      fail: (res)=>{
        const that = this;
        requestInfo(that, query, res, prevProps, songUrl, picUrl);
      }
    })
  },

  handlePlayBtnTap: function(){
    wx.getBackgroundAudioPlayerState({
      success: (res) => {
        const {
          currentPosition,
          dataUrl,
          downloadPercent,
          duration,
          errMsg,
          status,
        } = res;
        if (status == 0) {
          wx.seekBackgroundAudio({
            position: currentPosition
          })
        }else if(status == 1){
          wx.pauseBackgroundAudio()         
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.onBackgroundAudioPause(() => {
      clearInterval(this.data.player_info.timer);
    })
      // let count = 1;
      // const timer = setInterval(() => {
      //   const prevProps = Object.assign({}, this.data.player_info);
      //   prevProps['file_duration'] = timeFormat(duration)
      //   prevProps['picUrl'] = picUrl;
      //   prevProps['songUrl'] = songUrl;
      //   prevProps['count'] = count;
      //   prevProps['progress_time'] = timeFormat(count);
      //   prevProps['progress_value'] = 100 * count / duration;
      //   prevProps['timer'] = timer;
      //   app.globalData.player_info = prevProps;
      //   if (count == duration){
      //     clearInterval(timer);
      //   }
      //   count = count + 1;
      // }, 1000);
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})

function requestInfo(that, query, res, prevProps, songUrl, picUrl){
  const { reference1, apis, querys, queryTool } = app.globalData;
  wx.request({
    url: reference1 + apis.getSongInfo + query,
    method: "GET",
    success: (res) => {
      const duration = Math.ceil(res.data.songs[0].duration / 1000);
      prevProps['duration'] = timeFormat(duration)
      prevProps['name'] = res.data.songs[0].name;
      try {
        wx.setStorageSync('name', res.data.songs[0].name)
      } catch (e) {
        wx.setStorageSync('name', "佚名")
      }
      that.setData({ player_info: prevProps });
      app.globalData.player_info = prevProps;
      wx.playBackgroundAudio({
        dataUrl: songUrl,
        title: res.data.songs[0].name,
        coverImgUrl: picUrl,
        success: (res) => {
          let count = 1;
          const timer = setInterval(() => {
            prevProps['progress_value'] = 100 * count / duration;
            prevProps['count'] = count;
            prevProps['progress_time'] = timeFormat(count);
            prevProps['timer'] = timer;
            that.setData({
              player_info: prevProps
            })
            count = count + 1;
          }, 1000);
        }
      })
    }
  })
}

function audioState(res){
  
}

function timeFormat(seconds){
  const [
    hour,
    minite,
    second
  ] = [
      Math.floor(seconds / 3600),
      Math.floor((seconds % 3600) / 60),
      (seconds % 3600) % 60
    ]
  const hh = hour > 9? hour : "0" + hour;
  const mm = minite > 9 ? minite : "0" + minite;
  const ss = second > 9 ? second : "0" + second;
  // let file_duration = hh + ':' + mm + ":" + ss;
  let file_duration = mm + ":" + ss;
  return file_duration;
}