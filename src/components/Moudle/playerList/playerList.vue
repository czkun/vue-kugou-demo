<template>
  <div>
    <div class="playerList-bg" @click.self = "revisePlayerListShow(false)" v-show="playerListShow"></div>
    <transition name="slide">
      <div class="playerList-box" v-show="playerListShow">
        <div class="playerList-tt vux-1px-b">
          <span @click="playModeFun">
            <span v-if="playMode == 1"><i class="iconfont icon-shunxubofang"></i>顺序播放</span>
            <span v-if="playMode == 2"><i class="iconfont icon-suijibofang"></i>随机播放</span>
            <span v-if="playMode == 3"><i class="iconfont icon-xunhuan"></i>单曲循环</span>
            ({{playerList.length}})
          </span>
          <i class="iconfont icon-remove" @click="removeAllPlayerList"></i>
        </div>
        <div class="playerList-ct">
          <scroller lock-x height="300px" :scrollbar-y=true :scroll-bottom-offset="0" @on-scroll="scrollFun" ref="pListScroll" >
            <ul class="playerList-list">
              <li class="vux-1px-b" v-for="(item, index) in playerList" @click="playSong(index)">
                <span>{{index<9 ? '0' + (index+1) : (index+1)}}</span>
                <span v-if="index == nowIndex"><img :src="item.img" alt=""></span>
                <div>
                  <h2 :class="{blue:index == nowIndex}">{{item.song_name}}</h2>
                  <p :class="{blue:index == nowIndex}">{{item.author_name}}</p>
                </div>
                <i class="iconfont icon-remove" @click.stop="removePlayerList(index)"></i>
              </li>
            </ul>
          </scroller>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { Scroller } from 'vux'
  import { mapState, mapActions } from 'vuex'
  export default {
    components: {
      Scroller
    },
    data () {
      return {
        scrollY: 0
      }
    },
    watch: {
      nowIndex (val, old) {
        if (this.nowIndex > 5) {
          if (val > old && 50 * (this.nowIndex - 5) > this.scrollY) {
            this.$refs.pListScroll.reset({
              top: 50 * (this.nowIndex - 5)
            })
            this.scrollY = 50 * (this.nowIndex - 5)
          }
        } else if (this.nowIndex === 0) {
          this.$refs.pListScroll.reset({
            top: 0
          })
          this.scrollY = 0
        }
      }
    },
    methods: {
      ...mapActions({
        revisePlayerListShow: 'revisePlayerListShow',
        removePlayerList: 'removePlayerList',
        reviseNowIndex: 'reviseNowIndex',
        revisePlay: 'revisePlay',
        revisePlayMode: 'revisePlayMode'
      }),
      removeAllPlayerList () {
        let that = this
        this.$vux.confirm.show({
          content: '确定清空播放列表？',
          onConfirm () {
            that.removePlayerList(-1)
          }
        })
      },
      playSong (index) {
        this.reviseNowIndex(index)
        this.revisePlay(true)
      },
      scrollFun (pos) {
        this.scrollY = pos.top
      },
      playModeFun () {
        let i = this.playMode
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
      }
    },
    computed: {
      ...mapState({
        playerListShow: state => state.player.playerList.show,
        playerList: state => state.player.playerList.list,
        nowIndex: state => state.player.player.nowIndex,
        playMode: state => state.player.player.playMode
      })
    }
  }
</script>

<style lang="less">
  .playerList-bg{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 103;
    background-color: rgba(0,0,0,0.5);
  }
  .playerList-box{
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    height: 350px;
    z-index: 103;
    background-color: #ffffff;
    .playerList-tt{
      height: 50px;
      line-height: 50px;
      padding: 0 50px;
      span{
        font-size: 14px;
        i{
          float: left;
          margin-left:-50px;
          padding-top: 2px;
          width: 50px;
          height: 48px;
          text-align: center;
          font-size: 16px;
        }
      }
      .icon-remove{
        float: right;
        margin-right: -50px;
        width: 50px;
        height: 50px;
        text-align: center;
        font-size: 20px;
        color: #a5a5a5;
      }
    }
    .playerList-ct{
      height:300px;
    }
    .playerList-list{
      padding-left: 50px;
      li{
        position: relative;
        padding: 5px 50px 5px 0;
        span{
          position: absolute;
          top: 0;
          left: -50px;
          width: 50px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          font-size: 14px;
          img{
            vertical-align: middle;
            margin-top: -3px;
            width: 37px;
            height: 37px;
            border-radius: 50%;
          }
        }
        .icon-remove{
          position: absolute;
          right: 0;
          top: 0;
          width: 50px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          font-size: 20px;
          color: #a5a5a5;
        }
        h2{
          font-size: 14px;
          line-height: 20px;
          font-weight: normal;
        }
        p{
          font-size: 12px;
          line-height: 20px;
          color: #ababab;
        }
        .blue{
          color: rgb(44, 162, 249);
        }
      }
    }
  }
  .weui-dialog__btn_primary{
    color: rgb(44, 162, 249) !important;
  }

  .slide-leave-active,.slide-enter-active {
    transition: all 0.5s ease;
  }
  .slide-enter,.slide-leave-to{
    transform: translateY(350px);
  }
</style>
