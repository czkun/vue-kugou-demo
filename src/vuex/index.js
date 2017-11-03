import Vue from 'vue'
import Vuex from 'vuex'

import loading from './module/loading'
import songList from './module/songList'
import songMenu from './module/songMenu'
import singerList from './module/singerList'
import player from './module/player'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    koGouSize: 400
  },
  modules: {
    loading: loading,
    songList: songList,
    songMenu: songMenu,
    singerList: singerList,
    player: player
  }
})

export default store
