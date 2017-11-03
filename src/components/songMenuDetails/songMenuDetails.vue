<template>
  <div class="fullScreen">
    <x-header id="songMenuDetailsHeader" :left-options="{backText: ''}">{{info.specialname}}</x-header>
    <scroller lock-x :scrollbar-y=true @on-scroll="scrollFun" :scroll-bottom-offset="0" height="-60">
      <div>
        <blur v-if="info.imgurl" :blur-amount=15 :url="info.imgurl.replace('{size}',koGouSize)">
          <div class="songMenuDetails-top">
            <div class="songMenuDetails-top-img"><img v-if="info.imgurl" :src="info.imgurl.replace('{size}',koGouSize)" alt=""></div>
            <div class="songMenuDetails-top-table">
              <div class="songMenuDetails-top-tr">
                <h2>来自<span>{{info.nickname}}</span></h2>
                <p>创建时间<span>{{info.publishtime.substr(0,10)}}</span></p>
                <div><span v-for="item in info.tags">{{item.tagname}}</span></div>
              </div>
            </div>
          </div>
        </blur>
        <tab :line-width=2 active-color="#2ca2f9" defaultColor="#333333" id="sticky">
          <tab-item :selected="true" @on-item-click="tabs=0">
            歌曲列表/<span style="font-size: 12px;">{{totalSong}}</span>
          </tab-item>
          <tab-item @on-item-click="tabs=1">
            歌单简介
          </tab-item>
        </tab>
        <song-list v-show="!tabs"></song-list>
        <div class="songMenuDetails-ct" v-show="tabs" v-if="info.intro" v-html="info.intro.replace(/(\r\n)|(\n)/g,'<br>')"></div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import send from '@/service/getData.js'
  import {mapState, mapActions} from 'vuex'
  import { XHeader, Blur, Tab, TabItem, Scroller } from 'vux'
  import songList from '@/components/Moudle/songList/songList'
  export default {
    components: {
      XHeader,
      Blur,
      Tab,
      TabItem,
      Scroller,
      songList
    },
    created () {
      send.getSongMenuDetails(
        this.$route.query.specialid
      ).then((res) => {
        this.info = res.data.info.list
        this.totalSong = res.data.list.list.total
        this.updateList(res.data.list.list.info)
        this.$store.commit('updateLoadingStatus', {isLoading: false})
      })
    },
    data () {
      return {
        info: [],
        totalSong: 0,
        tabs: 0
      }
    },
    methods: {
      ...mapActions({
        updateList: 'updateList'
      }),
      scrollFun (pos) {
        if (pos.top >= 154) {
          document.getElementById('songMenuDetailsHeader').style.background = '#2ca2f9'
        } else {
          document.getElementById('songMenuDetailsHeader').style.background = '-webkit-linear-gradient(top,rgba(17,17,17,.6),transparent)'
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
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    background-color: #fff;
    z-index: 101;
  }
  #songMenuDetailsHeader{
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
  .songMenuDetails-top{
    padding: 66px 20px 0;
    .songMenuDetails-top-img{
      width: 100px;
      height: 100px;
      float: left;
      border: #fff 2px solid;
      margin-bottom: 20px;
      margin-right: 15px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .songMenuDetails-top-table{
      display: table;
      height: 100px;
      .songMenuDetails-top-tr{
        display: table-cell;
        vertical-align: middle;
        h2{
          font-size: 16px;
          font-weight: normal;
          color: #ffffff;
          span{
            margin-left: 10px;
          }
        }
        p{
          font-size: 14px;
          color: #fff;
          span{
            margin-left: 5px;
          }
        }
        div{
          span{
            margin-right: 5px;
            padding: 0 6px;
            font-size: 12px;
            color: #2ca2f9;
            border: #2ca2f9 1px solid;
            border-radius: 30px;
          }
        }
      }
    }
  }
  .songMenuDetails-ct{
    font-size: 16px;
    padding: 20px;
  }
</style>
