<template>
  <div>
    <div class="singerClassify-fixed" v-show="singerClassifyShow">
      <div class="singerClassify-box-snav">
        <flexbox :gutter="0"  wrap="wrap">
          <flexbox-item :span="1/3" v-for="(item,index) in singerClassify" v-if="index!=0" :key="index">
            <router-link :to="{name:'singerToList',query:{classid:item.classid}}">
              <div class="singerClassify-btn">{{item.classname}}</div>
            </router-link>
          </flexbox-item>
        </flexbox>
      </div>
    </div>

    <scroller v-if="singer" lock-x :scrollbar-y=true ref="classifyScroller" :scroll-bottom-offset="0" height="-150">
      <div>
        <div class="singerClassify-box">
          <flexbox>
            <flexbox-item>
              <div class="singerClassify-btn"  @click="singerClassifyShow = !singerClassifyShow"><i class="iconfont icon-geshou"></i>歌手分类<x-icon class="arrow" type="ios-arrow-down" size="22"></x-icon></div>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="singerRank">
          <div class="singerRank-tt vux-1px-b" v-if="singerClassify[0]">{{singerClassify[0].classname}}</div>
          <singer-list></singer-list>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import send from '@/service/getData.js'
  import {mapActions, mapState} from 'vuex'
  import { Flexbox, FlexboxItem, Scroller } from 'vux'
  import singerList from '@/components/Moudle/singerList/singerList'
  export default {
    components: {
      Flexbox,
      FlexboxItem,
      singerList,
      Scroller
    },
    created () {
      send.getSingerClassify().then((res) => {
        this.singerClassify = res.data.list
        send.getSingerList({
          classid: this.singerClassify[0].classid,
          page: 1
        }).then((result) => {
          this.updateSinger(result.data.singers.list.info)
          this.$refs.classifyScroller.reset()
          this.$store.commit('updateLoadingStatus', {isLoading: false})
        })
      })
    },
    data () {
      return {
        singerClassifyShow: false,
        singerClassify: []
      }
    },
    methods: {
      ...mapActions({
        updateSinger: 'updateSinger'
      })
    },
    computed: {
      ...mapState({
        singer: state => state.singerList.singer
      })
    }
  }
</script>

<style lang="less">
  .singerClassify-box{
    padding: 15px;
    background-color: #ffffff;
  }
  .singerClassify-btn{
    margin: 0 4px 8px;
    height: 45px;
    line-height: 45px;
    border: #ebebeb 1px solid;
    border-radius: 5px;
    text-align: center;
    font-size: 14px;
    color: rgb(51, 51, 51);
    i{
      vertical-align: middle;
      margin-right: 5px;
      font-size: 22px;
      color: #2ca2f9;
    }
    .arrow{
      vertical-align: middle;
      margin-left: 5px;
      margin-top: -2px;
    }
  }
  .singerClassify-fixed{
    position: fixed;
    top: 160px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background-color: rgba(0,0,0,0.5);
    .singerClassify-box-snav{
      background-color: #ffffff;
      padding: 0 15px;
    }
  }
  .singerRank{
    .singerRank-tt{
      margin: 0 19px;
      height: 35px;
      font-size: 16px;
      color: #2ca2f9;
    }
  }
</style>
