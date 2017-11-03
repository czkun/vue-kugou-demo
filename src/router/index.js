import Vue from 'vue'
import Router from 'vue-router'
import store from '@/vuex'
import { DELETE_LIST, DELETE_SINGER } from '../vuex/mutations-types'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'newSong',
    component: function (resolve) {
      require(['@/components/newSong/newSong'], resolve)
    }
  }, {
    path: '/rank',
    name: 'rank',
    component: function (resolve) {
      require(['@/components/rank/rank'], resolve)
    }
  }, {
    path: '/rank/rankSongList',
    name: 'rankSongList',
    component: function (resolve) {
      require(['@/components/rankSongList/rankSongList'], resolve)
    }
  }, {
    path: '/songMenu',
    name: 'songMenu',
    component: function (resolve) {
      require(['@/components/songMenu/songMenu'], resolve)
    }
  }, {
    path: '/songMenu/songMenuDetails',
    name: 'songMenuDetails',
    component: function (resolve) {
      require(['@/components/songMenuDetails/songMenuDetails'], resolve)
    }
  }, {
    path: '/singerClassify',
    name: 'singerClassify',
    component: function (resolve) {
      require(['@/components/singerClassify/singerClassify'], resolve)
    }
  }, {
    path: '/singerClassify/singerToList',
    name: 'singerToList',
    component: function (resolve) {
      require(['@/components/singerToList/singerToList'], resolve)
    }
  }, {
    path: '/singerClassify/singerToList/singerInfo',
    name: 'singerInfo',
    component: function (resolve) {
      require(['@/components/singerInfo/singerInfo'], resolve)
    }
  }, {
    path: '/search/search',
    name: 'search',
    component: function (resolve) {
      require(['@/components/search/search'], resolve)
    }
  }
]

const router = new Router({
  routes
})

router.beforeEach(function (to, from, next) {
  store.commit(DELETE_LIST)
  store.commit(DELETE_SINGER)
  next()
})
/* router.afterEach(function (to) {
  store.commit('updateLoadingStatus', {isLoading: true})
}) */

export default router
