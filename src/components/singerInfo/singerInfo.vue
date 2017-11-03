<template>
  <div class="fullScreen">
    <x-header id="singerInfoHeader" :left-options="{backText: ''}">{{info.singername}}</x-header>
    <scroller lock-x :scrollbar-y=true @on-scroll="scrollFun" ref="singerInfoScroll" @on-scroll-bottom="onScrollBottom" :scroll-bottom-offset="0" height="-60">
      <div>
        <div class="singerInfo-topImg" ref="singerInfoTopImg">
          <img v-if="info.imgurl" :src="info.imgurl.replace('{size}',koGouSize)" alt="">
        </div>
        <tab :line-width=2 active-color="#2ca2f9" defaultColor="#333333" id="sticky">
          <tab-item :selected="true" @on-item-click="tabs=0">
            歌曲列表/<span style="font-size: 12px;">{{totalSongs}}</span>
          </tab-item>
          <tab-item @on-item-click="tabs=1">
            歌手简介
          </tab-item>
        </tab>
        <song-list v-show="!tabs"></song-list>
        <div class="songMenuDetails-ct" v-show="tabs" v-if="info.intro" v-html="info.intro.replace(/(\r\n)|(\n)/g,'<br>')"></div>
        <div v-show="!tabs" style="overflow: hidden;">
          <load-more style="margin: 20px auto 0" :show-loading="loadShow" :tip="loadTip"></load-more>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import send from '@/service/getData.js'
  import {mapState, mapActions} from 'vuex'
  import { XHeader, Tab, TabItem, Scroller, LoadMore } from 'vux'
  import songList from '@/components/Moudle/songList/songList'
  export default {
    components: {
      XHeader,
      Tab,
      TabItem,
      Scroller,
      LoadMore,
      songList
    },
    created () {
      send.getSingerInfo({
        singerid: this.$route.query.singerid,
        page: this.page
      }).then((res) => {
        this.updateList(res.data.songs.list)
        this.info = res.data.info
        this.totalSongs = res.data.songs.total
        this.totalPage = Math.ceil(res.data.songs.total / res.data.songs.pagesize)
        if (this.totalPage === 1) {
          this.loadTip = '我是有底线的'
          this.loadShow = false
        }
        this.$store.commit('updateLoadingStatus', {isLoading: false})
      })
    },
    data () {
      return {
        info: [],
        tabs: 0,
        totalSongs: 0,

        page: 1,
        totalPage: 1,
        status: true,
        loadTip: '正在加载',
        loadShow: true
      }
    },
    methods: {
      ...mapActions({
        updateList: 'updateList',
        addList: 'addList'
      }),
      scrollFun (pos) {
        if (pos.top >= this.$refs.singerInfoTopImg.offsetHeight - 46) {
          document.getElementById('singerInfoHeader').style.background = '#2ca2f9'
        } else {
          document.getElementById('singerInfoHeader').style.background = '-webkit-linear-gradient(top,rgba(17,17,17,.6),transparent)'
        }
      },
      onScrollBottom () {
        if (this.status && this.page < this.totalPage) {
          this.status = false
          this.page++
          send.getSingerInfo({
            singerid: this.$route.query.singerid,
            page: this.page
          }).then((res) => {
            this.addList(res.data.songs.list).then(() => {
              this.$refs.singerInfoScroll.reset()
              this.status = true
            })
          })
        }
        if (this.page === this.totalPage) {
          this.loadShow = false
          this.loadTip = '我是有底线的'
          this.status = false
        }
      }
    },
    computed: {
      ...mapState({
        koGouSize: state => state.koGouSize
      })
    }
  }
</script>

<style lang="less">
  .fullScreen{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    background-color: #fff;
    z-index: 101;
  }
  #singerInfoHeader{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    background: -webkit-linear-gradient(top,rgba(17,17,17,.6),transparent);
    background: -o-linear-gradient(bottom, rgba(17,17,17,.6),transparent);
    background: -moz-linear-gradient(bottom,rgba(17,17,17,.6),transparent);
    background: linear-gradient(to bottom,rgba(17,17,17,.6),transparent);
    &.vux-header .vux-header-left .left-arrow:before{
      border-color: #fff;
    }
    .vux-header-title{
      margin: 0 40px;
      font-size: 16px;
    }
  }
  .singerInfo-topImg{
    position: relative;
    height: 0;
    padding-bottom: 75%;
    overflow: hidden;
    img{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
  }
  .songMenuDetails-ct{
    font-size: 16px;
    padding: 20px;
  }
</style>
