import {UPDATE_LIST, ADD_LIST, DELETE_LIST} from '../mutations-types'

export default {
  state: {
    list: []
  },
  mutations: {
    [UPDATE_LIST] (state, payload) {
      state.list = payload
    },
    [ADD_LIST] (state, payload) {
      state.list = [...state.list, ...payload]
    },
    [DELETE_LIST] (state, payload) {
      state.list = []
    }
  },
  actions: {
    updateList ({commit}, data) {
      commit(UPDATE_LIST, data)
    },
    addList ({commit}, data) {
      return new Promise((resolve, reject) => {
        commit(ADD_LIST, data)
        resolve()
      })
    }
  }
}
