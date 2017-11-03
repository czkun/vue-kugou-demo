<template>
  <div class="fullScreen">
    <x-header id="randHeader" class="rankSongList-header" :left-options="{backText: ''}">{{info.rankname}}</x-header>
    <scroller lock-x :scrollbar-y=true @on-scroll="scrollFun" @on-scroll-bottom="onScrollBottom" ref="rankScroll" :scroll-bottom-offset="0" height="-60">
      <div>
        <div class="rankSongList-img" ref="rankSongListImg">
          <div class="rankSongList-img-bg" v-if="info.banner7url" :style="{ backgroundImage: 'url(' + info.banner7url.replace('{size}', koGouSize) + ')' }">
          </div>
          <div class="rankSongList-img-ct">上次更新时间：{{today}}</div>
        </div>
        <song-list></song-list>
        <div style="overflow: hidden;">
          <load-more style="margin: 20px auto 0" :show-loading="loadShow" :tip="loadTip"></load-more>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import send from '@/service/getData.js'
  import {XHeader, Scroller, LoadMore} from 'vux'
  import songList from '@/components/Moudle/songList/songList'
  export default {
    components: {
      XHeader,
      songList,
      Scroller,
      LoadMore
    },
    created () {
      send.getRankSongList({
        rankid: this.$route.query.rankid,
        json: true,
        page: this.page
      }).then((res) => {
        this.updateList(res.data.songs.list)
        this.info = res.data.info
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
        info: {},
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
      onScrollBottom () {
        if (this.status && this.page < this.totalPage) {
          this.status = false
          this.page++
          send.getRankSongList({
            rankid: this.$route.query.rankid,
            json: true,
            page: this.page
          }).then((res) => {
            this.addList(res.data.songs.list).then(() => {
              this.$refs.rankScroll.reset()
              this.status = true
            })
          })
        }
        if (this.page === this.totalPage) {
          this.loadShow = false
          this.loadTip = '我是有底线的'
          this.status = false
        }
      },
      scrollFun (pos) {
        if (pos.top >= this.$refs.rankSongListImg.clientHeight - 46) {
          document.getElementById('randHeader').style.background = '#2ca2f9'
        } else {
          document.getElementById('randHeader').style.background = '-webkit-linear-gradient(top,rgba(17,17,17,.6),transparent)'
        }
      }
    },
    computed: {
      ...mapState({
        koGouSize: state => state.koGouSize
      }),
      today () {
        const d = new Date()
        const year = d.getFullYear()
        let month = d.getMonth() + 1
        let day = d.getDate()
        if (month < 10) month = '0' + month
        if (day < 10) day = '0' + day
        return year + '-' + month + '-' + day
      }
    }
  }
</script>

<style lang="less">
  .fullScreen{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    background-color: #fff;
    z-index: 101;
  }
  .rankSongList-header{
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
  }
  .rankSongList-img{
    position: relative;
    height: 0;
    padding-bottom: 60%;
    overflow: hidden;
    .rankSongList-img-bg{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-size: 100% auto;
      background-position: center center;
    }
    .rankSongList-img-ct{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 46px;
      line-height: 55px;
      padding: 0 18px;
      color: #ffffff;
      font-size: 12px;
      background: -webkit-linear-gradient(bottom,rgba(17,17,17,.6),transparent);
      background: -o-linear-gradient(top, rgba(17,17,17,.6),transparent);
      background: -moz-linear-gradient(top,rgba(17,17,17,.6),transparent);
      background: linear-gradient(to top,rgba(17,17,17,.6),transparent);
    }
  }
</style>
