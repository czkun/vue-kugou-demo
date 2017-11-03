<template>
  <div class="fullScreen">
    <x-header class="singerListHeader" style="background-color: #2ca2f9;" :left-options="{backText: ''}">{{classname}}</x-header>
    <scroller lock-x  height="-106" :scrollbar-y=true ref="singerScroll" @on-scroll-bottom="onScrollBottom" :scroll-bottom-offset="0">
      <singer-list></singer-list>
      <div style="overflow: hidden;">
        <load-more style="margin: 20px auto 0" :show-loading="loadShow" :tip="loadTip"></load-more>
      </div>
    </scroller>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import { XHeader, Scroller, LoadMore } from 'vux'
  import send from '@/service/getData.js'
  import singerList from '@/components/Moudle/singerList/singerList'
  export default {
    components: {
      XHeader,
      Scroller,
      LoadMore,
      singerList
    },
    created () {
      send.getSingerList({
        classid: this.$route.query.classid
      }).then((res) => {
        this.classname = res.data.classname
        this.updateSinger(res.data.singers.list.info)
        this.totalPage = Math.ceil(res.data.singers.list.total / res.data.singers.pagesize)
        if (this.totalPage === 1) {
          this.loadTip = '我是有底线的'
          this.loadShow = false
        }
        this.$store.commit('updateLoadingStatus', {isLoading: false})
      })
    },
    data () {
      return {
        classname: '',
        page: 1,
        totalPage: 1,
        status: true,
        loadTip: '正在加载',
        loadShow: true
      }
    },
    methods: {
      ...mapActions({
        updateSinger: 'updateSinger',
        addSinger: 'addSinger'
      }),
      onScrollBottom () {
        if (this.status && this.page < this.totalPage) {
          this.status = false
          this.page++
          send.getSingerList({
            classid: this.$route.query.classid,
            page: this.page
          }).then((res) => {
            this.addSinger(res.data.singers.list.info).then(() => {
              this.$refs.singerScroll.reset()
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
  .singerListHeader{
    .vux-header-left .left-arrow:before{
      border-color: #fff;
    }
  }
</style>
