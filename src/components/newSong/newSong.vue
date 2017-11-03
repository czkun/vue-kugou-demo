<template>
    <scroller lock-x :scrollbar-y=true :scroll-bottom-offset="0" height="-150">
      <div>
        <swiper loop auto :aspect-ratio="280/720" class="banner">
          <swiper-item v-for="(item,index) in banner" :key="index"><img :src="item.imgurl" alt=""></swiper-item>
        </swiper>
        <song-list></song-list>
      </div>
    </scroller>
</template>

<script>
  import {mapActions} from 'vuex'
  import { Swiper, SwiperItem, Scroller } from 'vux'
  import songList from '@/components/Moudle/songList/songList'
  import send from '@/service/getData.js'
  export default {
    components: {
      songList,
      Swiper,
      SwiperItem,
      Scroller
    },
    created () {
      /* this.$store.commit('updateLoadingStatus', {isLoading: true}) */
      send.getNewSongs().then((res) => {
        this.banner = res.data.banner
        this.updateList(res.data.data)
        this.$store.commit('updateLoadingStatus', {isLoading: false})
      })
    },
    data () {
      return {
        banner: []
      }
    },
    methods: {
      ...mapActions({
        updateList: 'updateList'
      })
    }
  }
</script>

<style lang="less">
  .banner img {
    width: 100%;
  }
</style>
