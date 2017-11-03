import {UPDATE_SONG_MENU_LIST, ADD_SONG_MENU_LIST} from '../mutations-types'

export default {
  state: {
    songMenuList: []
  },
  mutations: {
    [UPDATE_SONG_MENU_LIST] (state, payload) {
      state.songMenuList = payload
    },
    [ADD_SONG_MENU_LIST] (state, payload) {
      state.songMenuList = [...state.songMenuList, ...payload]
    }
  },
  actions: {
    updateSongMenuList ({commit}, data) {
      commit(UPDATE_SONG_MENU_LIST, data)
    },
    addSongMenuList ({commit}, data) {
      return new Promise((resolve, reject) => {
        commit(ADD_SONG_MENU_LIST, data)
        resolve()
      })
    }
  }
}
