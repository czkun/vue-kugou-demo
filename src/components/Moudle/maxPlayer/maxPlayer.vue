<template>
  <transition name="slide-bottom">
    <div class="maxPlayer-fullScreen" v-if="player.maxPlayerShow" >
      <div class="maxPlayer-bg" :style="{backgroundImage: 'url('+ player.nowPlaying.img +')'}"></div>
      <div class="maxPlayer-box">
        <x-header class="maxPlayer-header" @on-click-back="back" :left-options="{backText: '',preventGoBack:true}">{{player.nowPlaying.song_name}}</x-header>
        <div class="maxPlayer-top">
          <h2>{{player.nowPlaying.author_name}}</h2>
        </div>
        <div class="maxPlayer-lrc">
          <scroller lock-x height="-230" ref="maxPlayerLrcScroll">
            <div>
              <ul class="maxPlayer-lrc-list">
                <li v-for="(item, index) in songLrc" :class="{act: player.nowPlaying.currentTime > item.seconds && (index === songLrc.length-1 || player.nowPlaying.currentTime < songLrc[index+1].seconds)}">{{item.lrc}}</li>
              </ul>
            </div>
          </scroller>
        </div>
        <div class="maxPlayer-bottom">
          <div class="maxPlayer-rangeBox" @click="timeSiteChange">
            <span class="maxPlayer-rangeBox-currentTime">{{currentTime}}</span>
            <range class="maxPlayer-range" v-model="player.nowPlaying.currentTime" disabled :range-bar-height="2" :max="player.nowPlaying.timelength"></range>
            <span class="maxPlayer-rangeBox-timelength">{{timelength}}</span>
          </div>
          <div class="maxPlayer-btn">
            <span class="maxPlayer-btn-mode" @click="playModeFun">
              <i :class="['iconfont', {
                'icon-shunxubofang': player.playMode === 1,
                'icon-suijibofang': player.playMode === 2,
                'icon-xunhuan': player.playMode === 3,
              }]"></i>
            </span>
            <span class="maxPlayer-btn-prev" @click="prev">
              <i class="iconfont icon-shangyishou"></i>
            </span>
            <span class="maxPlayer-btn-play" @click="revisePlay(!player.play)">
              <i :class="['iconfont', player.play ? 'icon-pause' : 'icon-bofangsanjiaoxing']"></i>
            </span>
            <span class="maxPlayer-btn-next" @click="next">
              <i class="iconfont icon-xiayishou"></i>
            </span>
            <span class="maxPlayer-btn-listShow" @click="revisePlayerListShow(true)">
              <i class="iconfont icon-bofangliebiao"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { XHeader, Range, Scroller } from 'vux'
  export default {
    components: {
      XHeader,
      Range,
      Scroller
    },
    data () {
      return {
        lrcIndex: 0
      }
    },
    watch: {
      playerCurrentTime () {
        if (this.player.maxPlayerShow) {
          if (document.getElementsByClassName('act').length) {
            this.$refs.maxPlayerLrcScroll.reset({
              top: document.getElementsByClassName('act')[0].offsetTop - parseInt(this.$refs.maxPlayerLrcScroll.$el.offsetHeight / 2)
            })
          } else {
            this.$refs.maxPlayerLrcScroll.reset({
              top: -parseInt(this.$refs.maxPlayerLrcScroll.$el.offsetHeight / 2)
            })
          }
        }
      }
    },
    methods: {
      ...mapActions({
        reviseMaxPlayerShow: 'reviseMaxPlayerShow',
        revisePlay: 'revisePlay',
        revisePlayerListShow: 'revisePlayerListShow',
        revisePlayMode: 'revisePlayMode',
        reviseCurrentTime: 'reviseCurrentTime',
        next: 'next',
        prev: 'prev'
      }),
      back () {
        this.reviseMaxPlayerShow(false)
      },
      playModeFun () {
        let i = this.player.playMode
        if (i === 3) {
          i = 1
        } else {
          i++
        }
        if (i === 3) {
          document.getElementById('audioPlay').loop = true
        } else {
          document.getElementById('audioPlay').loop = false
        }
        this.revisePlayMode(i)
      },
      timeSiteChange () {
        if (this.player.play) {
          let e = event || window.event
          let site = (e.clientX - 45) / document.getElementsByClassName('maxPlayer-rangeBox')[0].clientWidth * this.player.nowPlaying.timelength
          this.reviseCurrentTime(site)
          document.getElementById('audioPlay').currentTime = site / 1000
        }
      }
    },
    computed: {
      ...mapState({
        player: state => state.player.player,
        playerCurrentTime: state => state.player.player.nowPlaying.currentTime
      }),
      currentTime () {
        let time = parseInt(this.player.nowPlaying.currentTime / 1000)
        let minute = parseInt(time / 60)
        let sec = time % 60 < 10 ? '0' + time % 60 : time % 60
        return minute + ':' + sec
      },
      timelength () {
        let time = parseInt(this.player.nowPlaying.timelength / 1000)
        let minute = parseInt(time / 60)
        let sec = time % 60 < 10 ? '0' + time % 60 : time % 60
        return minute + ':' + sec
      },
      songLrc () {
        if (this.player.nowPlaying.lyrics) {
          let temp = this.player.nowPlaying.lyrics.split('\r\n')
          temp = temp.splice(0, temp.length - 1)
          temp = temp.map((value) => {
            let time = value.substr(1, 5)
            let seconds = parseFloat(time.split(':')[0] * 60 + parseFloat(time.split(':')[1])) * 1000
            let lrc = value.substr(10)
            return {
              seconds,
              lrc
            }
          })
          return temp
        }
      }
    }
  }
</script>

<style lang="less">
  .maxPlayer-fullScreen{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    background-color: #fff;
    z-index: 103;
  }
  .maxPlayer-header{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    background-color: transparent;
    color: #edefef;
    &.vux-header .vux-header-left .left-arrow:before{
      border-color: #fff;
    }
    .vux-header-title{
      margin: 0 40px;
      font-size: 16px;
    }
  }
  .maxPlayer-bg{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: top center;
  }
  .maxPlayer-box{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0,0,0,0.6);
    .maxPlayer-top{
      padding-top: 46px;
      text-align: center;
      h2{
        color: #edefef;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        &:before, &:after{
          content: '';
          margin: 0 5px;
          display: inline-block;
          vertical-align: middle;
          width: 20px;
          border-bottom:#edefef 1px solid;
        }
      }
    }
  }
  .maxPlayer-bottom{
    position: fixed;
    bottom: 20px;
    left: 0;
    right: 0;
    padding: 0 15px;
    text-align: center;
    .maxPlayer-btn{
      height: 68px;
      left: 68px;
      span{
        display: inline-block;
        vertical-align: middle;
      }
      .maxPlayer-btn-mode{
        float: left;
        width: 38px;
        height: 38px;
        line-height: 38px;
        margin-top: 15px;
        i{
          font-size: 22px;
          color: #edefef;
        }
      }
      .maxPlayer-btn-prev{
        width: 42px;
        height: 42px;
        line-height: 42px;
        text-align: center;
        border-radius: 50%;
        margin-right: 10px;
        background-color: #5dafac;
        i{
          font-size: 20px;
          color: #ffffff;
        }
      }
      .maxPlayer-btn-play{
        width: 68px;
        height: 68px;
        line-height: 68px;
        text-align: center;
        border-radius: 50%;
        background-color: #5dafac;
        i{
          font-size: 40px;
          color: #ffffff;
          &.icon-bofangsanjiaoxing{
            margin-left: 10px;
          }
        }
      }
      .maxPlayer-btn-next{
        width: 42px;
        height: 42px;
        line-height: 42px;
        text-align: center;
        border-radius: 50%;
        margin-left: 10px;
        background-color: #5dafac;
        i{
          font-size: 20px;
          color: #ffffff;
        }
      }
      .maxPlayer-btn-listShow{
        float: right;
        width: 38px;
        height: 38px;
        line-height: 38px;
        margin-top: 15px;
        i{
          font-size: 24px;
          color: #edefef;
        }
      }
    }
  }
  .maxPlayer-rangeBox{
    padding: 5px 0;
    margin: 0 30px 14px;
    position: relative;
    .maxPlayer-rangeBox-currentTime{
      position: absolute;
      top: -4px;
      left: -40px;
      color: #ffffff;
      width: 40px;
      text-align: center;
      font-size: 12px;
    }
    .maxPlayer-rangeBox-timelength{
      position: absolute;
      top: -4px;
      right: -40px;
      color: #ffffff;
      width: 40px;
      text-align: center;
      font-size: 12px;
      line-height: 20px;
    }
    .maxPlayer-range{
      margin: 0 !important;
      .range-bar-disabled{
        opacity:1;
      }
      .range-min,.range-max{
        display: none;
        color: #ffffff;
      }
      .range-handle{
        background-color: #fff;
        width: 15px;
        height: 15px;
        top: -6px !important;
      }
      .range-quantity{
        background-color: #5dafac;
      }
    }
  }
  .maxPlayer-lrc{
    margin: 20px 0 30px;
    overflow: hidden;
    .xs-container{
      transition: all 0.5s linear;
    }
    .maxPlayer-lrc-list{
      text-align: center;
      color: #ffffff;
      font-size: 14px;
      line-height: 24px;
      li.act{
        color: #f4f27d;
      }
    }
  }

  .slide-bottom-leave-active,.slide-bottom-enter-active {
    transition: all 0.5s ease;
  }
  .slide-bottom-enter,.slide-bottom-leave-to{
    transform: translateX(100%);
  }
</style>
