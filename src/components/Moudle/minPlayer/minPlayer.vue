<template>
  <div class="minPlayer">
    <audio :src="player.nowPlaying.play_url" :autoplay=play id="audioPlay" @timeupdate="change()" @ended="next"></audio>
    <div class="minPlayer-img" @click="reviseMaxPlayerShow(true)">
      <img v-if="player.nowPlaying.img" :style="{ transform : 'rotate(' + rotate + 'deg)' }" :src="player.nowPlaying.img" alt="">
      <img v-if="!player.nowPlaying.img" src="../../../base/img/songImg.png" alt="">
    </div>
    <div class="minPlayer-rangeBox" @click="timeSiteChange">
      <range class="minPlayer-range" v-model="player.nowPlaying.currentTime" disabled :range-bar-height="2" :max="player.nowPlaying.timelength"></range>
    </div>
    <div class="minPlayer-ct">
      <h2>{{player.nowPlaying.song_name}}</h2>
      <p>{{player.nowPlaying.author_name}}</p>
      <div class="minPlayer-ct-btn">
        <i :class="['iconfont', play ? 'icon-pause' : 'icon-bofangsanjiaoxing']" @click="revisePlay(!play)"></i>
        <i class="iconfont icon-xiayishou" @click="next"></i>
        <i class="iconfont icon-bofangliebiao" @click="revisePlayerListShow(true)"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import { Range } from 'vux'
  import { mapState, mapActions } from 'vuex'
  export default {
    components: {
      Range
    },
    watch: {
      play () {
        if (this.play) {
          document.getElementById('audioPlay').play()
          let that = this
          this.timer = setInterval(function () {
            if (that.rotate >= 360) {
              that.rotate = 0
            }
            that.rotate++
          }, 20)
        } else {
          document.getElementById('audioPlay').pause()
          clearInterval(this.timer)
        }
      },
      nowIndex () {
        if (this.nowIndex !== -1) {
          this.nowIndexReviseSong()
        }
      }
    },
    data () {
      return {
        rotate: 0,
        timer: ''
      }
    },
    methods: {
      ...mapActions({
        revisePlayerListShow: 'revisePlayerListShow',
        revisePlay: 'revisePlay',
        reviseCurrentTime: 'reviseCurrentTime',
        nowIndexReviseSong: 'nowIndexReviseSong',
        reviseMaxPlayerShow: 'reviseMaxPlayerShow',
        next: 'next'
      }),
      change () {
        this.reviseCurrentTime(document.getElementById('audioPlay').currentTime * 1000)
      },
      timeSiteChange () {
        if (this.play) {
          let e = event || window.event
          let site = (e.clientX - 80) / document.getElementsByClassName('minPlayer-rangeBox')[0].clientWidth * this.player.nowPlaying.timelength
          this.reviseCurrentTime(site)
          document.getElementById('audioPlay').currentTime = site / 1000
        }
      }
    },
    computed: {
      ...mapState({
        player: state => state.player.player,
        play: state => state.player.player.play,
        nowIndex: state => state.player.player.nowIndex
      })
    }
  }
</script>

<style lang="less">
  .minPlayer{
    height: 55px;
    padding: 0 10px 0 80px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    box-shadow: 0 -2px 2px #e9e9e9;
    background-color: #ffffff;
    .minPlayer-img{
      float: left;
      width: 60px;
      height: 60px;
      margin-left: -70px;
      margin-top: -10px;
      border-radius: 50%;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-shadow: 0 0 10px #999;
      }
    }
    .minPlayer-ct{
      position: relative;
      margin-top: 3px;
      padding-right: 118px;
      h2{
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      p{
        font-size: 12px;
        line-height: 18px;
        color: #ababab;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .minPlayer-ct-btn{
        position: absolute;
        right: 0;
        top: 5px;
        i{
          display: inline-block;
          vertical-align: middle;
          font-size: 26px;
          width:36px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          color: #555555;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          &.icon-bofangsanjiaoxing{
            padding-left: 6px;
            padding-top: 3px;
          }
          &.icon-pause{
            padding-top: 4px;
          }
          &.icon-xiayishou{
            padding-top: 2px;
            font-size: 24px;
          }
          &.icon-bofangliebiao{
            font-size: 22px;
            padding-top: 4px;
          }
        }
      }
    }
  }
  .minPlayer-rangeBox{
    padding-top: 8px;
  }
  .minPlayer-range{
    margin: 0 !important;
    .range-bar-disabled{
      opacity:1;
    }
    .range-min,.range-max{
      display: none;
    }
    .range-handle{
      background-color: #51ccff;
      width: 8px;
      height: 8px;
      top: -3px !important;
    }
    .range-quantity{
      background-color: #51ccff;
    }
  }
</style>
