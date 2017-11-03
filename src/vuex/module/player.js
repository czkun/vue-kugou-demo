import { REVISE_PLAYER_LIST_SHOW, LOAD_PLAYER_LIST, ADD_PLAYER_LIST, REMOVE_PLAYER_LIST, REVISE_PLAY, REVISE_CURRENT_TIME, NOW_INDEX_REVISE_SONG, REVISE_NOW_INDEX, REVISE_PLAY_MODE, REVISE_MAX_PLAYER_SHOW, SWITCH_SONG } from '../mutations-types'
import { numberRandom } from 'vux'

export default {
  state: {
    playerList: {
      show: false,
      list: []
    },
    player: {
      play: false,
      maxPlayerShow: false,
      nowIndex: -1,
      playMode: 1,       // 1：顺序播放 2：随机播放 3：单曲循环
      nowPlaying: {
        author_name: '就是歌多',
        hash: '',
        img: '',
        lyrics: '',
        play_url: '',
        song_name: '酷狗音乐',
        timelength: 0,
        currentTime: 0
      }
    }
  },
  mutations: {
    [REVISE_PLAYER_LIST_SHOW] (state, payload) {
      state.playerList.show = payload
    },
    [LOAD_PLAYER_LIST] (state, payload) {
      state.playerList.list = payload
      state.player.nowIndex = 0
      let data = state.playerList.list[0]
      state.player.nowPlaying = {
        author_name: data.author_name,
        hash: data.hash,
        img: data.img,
        lyrics: data.lyrics,
        play_url: data.play_url,
        song_name: data.song_name,
        timelength: data.timelength,
        currentTime: 0
      }
    },
    [ADD_PLAYER_LIST] (state, payload) {
      state.playerList.list.push(payload)
      localStorage.setItem('playerList', JSON.stringify(state.playerList.list))
      if (state.player.nowIndex === -1) {
        state.player.nowIndex = 0
      }
    },
    [REMOVE_PLAYER_LIST] (state, payload) {
      if (payload >= 0) {
        state.playerList.list.splice(payload, 1)
        if (payload < state.player.nowIndex) {
          state.player.nowIndex--
          console.log(state.player.nowIndex)
        } else if (payload === state.player.nowIndex) {
          let data = state.playerList.list[state.player.nowIndex]
          state.player.nowPlaying = {
            author_name: data.author_name,
            hash: data.hash,
            img: data.img,
            lyrics: data.lyrics,
            play_url: data.play_url,
            song_name: data.song_name,
            timelength: data.timelength,
            currentTime: 0
          }
        }
        if (!state.playerList.list.length) {
          localStorage.removeItem('playerList')
          return false
        }
        localStorage.setItem('playerList', JSON.stringify(state.playerList.list))
      } else {
        state.playerList.list = []
        state.player.play = false
        state.player.nowIndex = -1
        state.player.nowPlaying = {
          author_name: '就是歌多',
          hash: '',
          img: '',
          lyrics: '',
          play_url: '',
          song_name: '酷狗音乐',
          timelength: 0,
          currentTime: 0
        }
        localStorage.removeItem('playerList')
      }
    },
    [REVISE_PLAY] (state, payload) {
      state.player.play = payload
    },
    [REVISE_CURRENT_TIME] (state, payload) {
      state.player.nowPlaying.currentTime = payload
    },
    [NOW_INDEX_REVISE_SONG] (state) {
      let data = state.playerList.list[state.player.nowIndex]
      state.player.nowPlaying = {
        author_name: data.author_name,
        hash: data.hash,
        img: data.img,
        lyrics: data.lyrics,
        play_url: data.play_url,
        song_name: data.song_name,
        timelength: data.timelength,
        currentTime: 0
      }
    },
    [REVISE_NOW_INDEX] (state, payload) {
      state.player.nowIndex = payload
    },
    [REVISE_PLAY_MODE] (state, payload) {
      state.player.playMode = payload
    },
    [REVISE_MAX_PLAYER_SHOW] (state, payload) {
      state.player.maxPlayerShow = payload
    },
    [SWITCH_SONG] (state, payload) {
      if (state.player.playMode === 1) {
        if (payload === 'next') {
          if (state.player.nowIndex < state.playerList.list.length - 1) {
            state.player.nowIndex++
          } else {
            state.player.nowIndex = 0
          }
        } else if (payload === 'prev') {
          if (state.player.nowIndex === 0) {
            state.player.nowIndex = state.playerList.list.length - 1
          } else {
            state.player.nowIndex--
          }
        }
      } else if (state.player.playMode === 2) {
        while (true) {
          let num = numberRandom(0, state.playerList.list.length - 1)
          if (num !== state.player.nowIndex) {
            state.player.nowIndex = num
            break
          }
        }
      }
    }
  },
  actions: {
    revisePlayerListShow ({commit}, data) {
      commit(REVISE_PLAYER_LIST_SHOW, data)
    },
    loadPlayerList ({commit}, data) {
      commit(LOAD_PLAYER_LIST, data)
    },
    addPlayerList ({commit}, data) {
      return new Promise((resolve, reject) => {
        commit(ADD_PLAYER_LIST, data)
        resolve()
      })
    },
    removePlayerList ({commit}, data) {
      commit(REMOVE_PLAYER_LIST, data)
    },

    revisePlay ({commit, state}, data) {
      if (state.player.nowIndex >= 0) {
        commit(REVISE_PLAY, data)
      }
    },
    reviseCurrentTime ({commit}, data) {
      commit(REVISE_CURRENT_TIME, data)
    },
    nowIndexReviseSong ({commit}) {
      commit(NOW_INDEX_REVISE_SONG)
    },
    reviseNowIndex ({commit}, data) {
      commit(REVISE_NOW_INDEX, data)
    },
    revisePlayMode ({commit}, data) {
      commit(REVISE_PLAY_MODE, data)
    },
    reviseMaxPlayerShow ({commit}, data) {
      commit(REVISE_MAX_PLAYER_SHOW, data)
    },
    prev ({commit, state}) {
      if (state.player.nowIndex >= 0) {
        commit(SWITCH_SONG, 'prev')
      }
    },
    next ({commit, state}) {
      if (state.player.nowIndex >= 0) {
        commit(SWITCH_SONG, 'next')
      }
    }
  }
}
