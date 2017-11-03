<template>
  <div style="height:100%;">
    <view-box ref="viewBox" body-padding-top="90px" body-padding-bottom="60px">
      <div  slot="header">
        <x-header style="position:fixed;left:0;top:0;width:100%;z-index:100;background-color: #2ca2f9;" :left-options="{showBack: false}">
          <router-link to="/"  slot="left">
            <h1 class="logo-box">
              酷狗
            </h1>
          </router-link>
          <router-link slot="right" :to="{name:'search'}">
            <x-icon type="ios-search-strong" style="fill:#fff;margin-top: -5px;" size="30" ></x-icon>
          </router-link>
        </x-header>
        <tabs-top style="position: fixed;top: 46px;left: 0;width: 100%;z-index: 100"></tabs-top>
      </div>
      <transition :name="transitionName" slot="default">
        <router-view class="child-view"></router-view>
      </transition>
      <min-player style="position:fixed;left:0;bottom:0;width:100%;z-index:102;" slot="bottom"></min-player>
    </view-box>
    <loading v-model="isLoading"></loading>
    <max-player></max-player>
    <player-list></player-list>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { ViewBox, XHeader, Loading } from 'vux'
  import tabsTop from '@/components/Moudle/tabsTop/tabsTop'
  import playerList from '@/components/Moudle/playerList/playerList'
  import minPlayer from '@/components/Moudle/minPlayer/minPlayer'
  import maxPlayer from '@/components/Moudle/maxPlayer/maxPlayer'
  export default {
    components: {
      ViewBox,
      XHeader,
      Loading,
      tabsTop,
      playerList,
      minPlayer,
      maxPlayer
    },
    created () {
      if (localStorage.getItem('playerList')) {
        this.loadPlayerList(JSON.parse(localStorage.getItem('playerList')))
      }
    },
    data () {
      return {
        transitionName: 'slide-left'
      }
    },
    watch: {
      '$route' (to, from) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
    },
    methods: {
      ...mapActions({
        loadPlayerList: 'loadPlayerList'
      })
    },
    computed: {
      ...mapState({
        isLoading: state => state.loading.isLoading
      })
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';

  html, body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    font-family: '微软雅黑';
  }
  ul {
    list-style: none;
  }
  .logo-box {
    width: 115px;
    height: 25px;
    margin-top: -3px;
    background-size: auto 25px;
    background-image: url("./base/img/logo.png");
    background-repeat: no-repeat;
    text-indent: -10000em;
    overflow: hidden;
  }

  .child-view {
    position: absolute;
    width: 100%;
    transition: all .4s ease;
  }
  .slide-left-enter, .slide-right-leave-active {
    transform: translateX(100%);
  }
  .slide-left-leave-active, .slide-right-enter {
    transform: translateX(-100%);
  }
</style>
