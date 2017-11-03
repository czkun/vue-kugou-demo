import {UPDATE_SINGER, DELETE_SINGER, ADD_SINGER} from '../mutations-types'

export default {
  state: {
    singer: []
  },
  mutations: {
    [UPDATE_SINGER] (state, payload) {
      state.singer = payload
    },
    [ADD_SINGER] (state, payload) {
      state.singer = [...state.singer, ...payload]
    },
    [DELETE_SINGER] (state, payload) {
      state.singer = []
    }
  },
  actions: {
    updateSinger ({commit}, data) {
      commit(UPDATE_SINGER, data)
    },
    addSinger ({commit}, data) {
      return new Promise((resolve, reject) => {
        commit(ADD_SINGER, data)
        resolve()
      })
    }
  }
}
