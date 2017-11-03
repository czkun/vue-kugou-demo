<template>
  <scroller lock-x :scrollbar-y=true ref="songMenuScroll" @on-scroll-bottom="onScrollBottom" :scroll-bottom-offset="0" height="-150">
    <div>
      <ul class="songMenu">
        <li v-for="item in songMenuList">
          <router-link :to="{name: 'songMenuDetails',query:{specialid:item.specialid}}">
            <div class="songMenu-box">
              <img class="songMenu-img" :src="item.imgurl.replace('{size}',koGouSize)" alt="">
              <p class="songMenu-playcount"><i class="iconfont icon-erji"></i>{{item.playcount}}</p>
              <div class="songMenu-user"><img :src="item.user_avatar" alt="">{{item.username}}</div>
              <i class="iconfont icon-bofang"></i>
            </div>
            <h2 class="">{{item.specialname}}</h2>
          </router-link>
        </li>
      </ul>
      <div style="overflow: hidden;">
        <load-more style="margin: 10px auto" :show-loading="loadShow" :tip="loadTip"></load-more>
      </div>
    </div>
  </scroller>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import send from '@/service/getData.js'
  import {Scroller, LoadMore} from 'vux'
  export default {
    components: {
      Scroller,
      LoadMore
    },
    created () {
      send.getSongMenu({
        page: this.page
      }).then((res) => {
        this.updateSongMenuList(res.data.plist.list.info)
        this.totalPage = Math.ceil(res.data.plist.list.total / res.data.plist.pagesize)
        if (this.totalPage === 1) {
          this.loadTip = '我是有底线的'
          this.loadShow = false
        }
        this.$store.commit('updateLoadingStatus', {isLoading: false})
      })
    },
    data () {
      return {
        page: 1,
        totalPage: 1,
        status: true,
        loadTip: '正在加载',
        loadShow: true
      }
    },
    methods: {
      ...mapActions({
        updateSongMenuList: 'updateSongMenuList',
        addSongMenuList: 'addSongMenuList'
      }),
      onScrollBottom () {
        if (this.status && this.page < this.totalPage) {
          this.status = false
          this.page++
          send.getSongMenu({
            page: this.page
          }).then((res) => {
            this.addSongMenuList(res.data.plist.list.info).then(() => {
              this.$refs.songMenuScroll.reset()
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
        songMenuList: state => state.songMenu.songMenuList,
        koGouSize: state => state.koGouSize
      })
    }
  }
</script>

<style lang="less">
  .songMenu{
    &:after{
      display: table;
      content: '';
      clear: both;
    }
    li{
      width: 50%;
      float: left;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      &:nth-child(odd){
        padding-right: 2px;
      }
      &:nth-child(even){
        padding-left: 2px;
      }
      .songMenu-box{
        position: relative;
        width: 100%;
        padding-bottom: 100%;
        .songMenu-img{
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .songMenu-playcount{
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          z-index: 1;
          padding: 5px 10px;
          color: #ffffff;
          font-size: 12px;
          background: -webkit-linear-gradient(top,rgba(17,17,17,.6),transparent);
          background: -o-linear-gradient(bottom, rgba(17,17,17,.6),transparent);
          background: -moz-linear-gradient(bottom,rgba(17,17,17,.6),transparent);
          background: linear-gradient(to bottom,rgba(17,17,17,.6),transparent);
          i{
            font-size: 12px;
            margin-right: 5px;
          }
        }
        .songMenu-user{
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1;
          padding: 0 10px 10px;
          font-size: 10px;
          color: #e3e3e3;
          padding-right: 45px;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          img{
            width: 26px;
            height: 26px;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 5px;
          }
        }
        .icon-bofang{
          font-size: 30px;
          height: 30px;
          position: absolute;
          right: 10px;
          bottom: 10px;
          line-height: 30px;
          color: #e3e3e3;
        }
      }
      h2{
        margin: 10px;
        font-size: 14px;
        color: #696969;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        height: 40px;
        line-height: 20px;
        font-weight: normal;
      }
    }
  }
</style>
