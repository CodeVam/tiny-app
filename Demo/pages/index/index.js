//index.js
//获取应用实例

var app = getApp();
Page({
  data: {
    display: false,
    songs: []
  },
  //事件处理函数
  onLoad: function () {
    console.log('onLoad')
  },
  handleSearch: function (ev) {
    const { reference2, apis, querys, queryTool } = app.globalData;
    querys.getSearchList['s'] = ev.detail.value;
    const query = queryTool(querys.getSearchList);
    wx.request({
      url: reference2 + apis.getSearchList + query,
      method: "POST",
      success: (res)=>{
        const data = res.data;
        if (data.code == 200){
          const songs = data.result?data.result.songs : [];
          this.setData({
            display: true,
            songs
          })
        }
      }
    })
  },
  handleTap: function (ev) {
    const { id, dataset } = ev.currentTarget;
    wx.setStorageSync("picUrl", dataset._pic);
    wx.setStorageSync("songUrl", dataset._audio);
    wx.navigateTo({
      url: `/pages/player/player?id=${id}`
    });
  } 
})

