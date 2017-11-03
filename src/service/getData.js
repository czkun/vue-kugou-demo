import Vue from 'vue'
import { AjaxPlugin } from 'vux'
Vue.use(AjaxPlugin)

export default {
  /* 获取新歌 */
  getNewSongs () {
    return Vue.http.get('/m/?json=true')
  },

  /* 获取排行榜 */
  getRank () {
    return Vue.http.get('/m/rank/list&json=true')
  },

  /* 获取排行榜下歌曲列表 */
  getRankSongList (par) {
    return Vue.http.get('/m/rank/info/', {params: par})
  },

  /* 获取歌单列表 */
  getSongMenu (par) {
    return Vue.http.get('/m/plist/index&json=true', {params: par})
  },

  /* 获取歌单歌曲列表详情 */
  getSongMenuDetails (par) {
    return Vue.http.get('/m/plist/list/' + par + '?json=true')
  },

  /* 获取歌手分类 */
  getSingerClassify () {
    return Vue.http.get('/m/singer/class&json=true')
  },

  /* 获取歌手分类下面的歌手列表 */
  getSingerList (par) {
    return Vue.http.get('/m/singer/list/' + par.classid + '?json=true&page=' + par.page)
  },

  /* 歌手信息 */
  getSingerInfo (par) {
    return Vue.http.get('/m/singer/info/' + par.singerid + '?json=true&page=' + par.page)
  },

  /* 热门搜索列表 */
  getHotSearch () {
    return Vue.http.get('/aproxy/api/v3/search/hot?format=json&plat=0&count=30')
  },

  /* 音乐搜索 */
  getSongSearch (par) {
    return Vue.http.get('/aproxy/api/v3/search/song', {params: par})
  },

  /* 音乐详情 */
  getSongDetails (par) {
    return Vue.http.get('/www/yy/index.php?r=play/getdata', {params: par})
  }
}

