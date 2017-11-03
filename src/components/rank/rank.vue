<template>
  <scroller lock-x :scrollbar-y=true :scroll-bottom-offset="0" height="-150">
    <div>
      <ul class="rank-list">
        <li class="vux-1px-b" v-for="item in rank.list">
          <router-link :to="{name: 'rankSongList',query:{rankid:item.rankid}}">
            <img :src="item.imgurl.replace('{size}', koGouSize)" alt="">
            <strong>{{item.rankname}}</strong>
            <x-icon type="ios-arrow-right" size="24"></x-icon>
          </router-link>
        </li>
      </ul>
    </div>
  </scroller>
</template>

<script>
  import send from '@/service/getData.js'
  import {mapState} from 'vuex'
  import { Scroller } from 'vux'
  export default {
    components: {
      Scroller
    },
    created () {
      send.getRank().then((res) => {
        this.rank = res.data.rank
        this.$store.commit('updateLoadingStatus', {isLoading: false})
      })
    },
    data () {
      return {
        rank: []
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
.rank-list{
  li{
    padding: 12px;
    height: 80px;
    line-height: 80px;
    color: #333333;
    a{
      display: block;
    }
    img{
      width: 80px;
      height: 80px;
      float: left;
      margin-right: 12px;
    }
    strong{
      color: #333333;
      font-size: 16px;
      font-weight: normal;
    }
    .vux-x-icon {
      fill: #ccc;
      float: right;
      margin-top: 28px;
    }
  }
}
</style>
