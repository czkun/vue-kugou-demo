<template>
  <ul class="songList">
    <li class="vux-1px-b" v-for="(item, index) in songListData">
      <strong>{{index+1}}</strong>
      <h2 :class="{blue:item.hash.toLowerCase() === player.nowPlaying.hash.toLowerCase()}">{{item.filename}}</h2>
      <p :class="{blue:item.hash.toLowerCase() === player.nowPlaying.hash.toLowerCase()}">{{item.remark}}</p>
      <i :class="['iconfont',item.hash.toLowerCase() === player.nowPlaying.hash.toLowerCase() && player.play ? 'icon-pause':'icon-bofangsanjiaoxing']" @click="getPlaySongDetails(item.hash)"></i>
      <i class="iconfont icon-tianjia1-copy" @click="getSongDetails(item.hash)"></i>
    </li>
  </ul>
</template>

<script>
  import send from '@/service/getData.js'
  import {mapState, mapActions} from 'vuex'
  export default {
    data () {
      return {
      }
    },
    methods: {
      ...mapActions({
        addPlayerList: 'addPlayerList',
        reviseNowIndex: 'reviseNowIndex',
        revisePlay: 'revisePlay'
      }),
      getSongDetails (hash) {
        for (let i in this.playerList) {
          if (this.playerList[i].hash === hash) {
            return false
          }
        }
        send.getSongDetails({
          hash: hash
        }).then((res) => {
          this.addPlayerList({
            hash: res.data.data.hash,
            author_name: res.data.data.author_name,
            song_name: res.data.data.song_name,
            img: res.data.data.img,
            play_url: res.data.data.play_url,
            timelength: res.data.data.timelength,
            lyrics: res.data.data.lyrics
          })
        })
      },
      getPlaySongDetails (hash) {
        if (hash.toLowerCase() === this.player.nowPlaying.hash.toLowerCase()) {
          this.revisePlay(!this.player.play)
          return false
        }
        for (let i in this.playerList) {
          if (this.playerList[i].hash === hash) {
            this.reviseNowIndex(i)
            this.revisePlay(true)
            return false
          }
        }
        send.getSongDetails({
          hash: hash
        }).then((res) => {
          this.addPlayerList({
            hash: res.data.data.hash,
            author_name: res.data.data.author_name,
            song_name: res.data.data.song_name,
            img: res.data.data.img,
            play_url: res.data.data.play_url,
            timelength: res.data.data.timelength,
            lyrics: res.data.data.lyrics
          }).then((res) => {
            this.reviseNowIndex(this.playerList.length - 1)
            this.revisePlay(true)
          })
        })
      }
    },
    computed: {
      ...mapState({
        songListData: state => state.songList.list,
        playerList: state => state.player.playerList.list,
        player: state => state.player.player
      })
    }
  }
</script>

<style lang="less">
  .songList{
    padding-left: 50px;
    li{
      padding: 11px 74px 11px 0;
      position: relative;
      &:nth-child(1){
        strong{
          color: #fff;
          background-color: #e80000;
        }
      }
      &:nth-child(2){
        strong{
          color: #fff;
          background-color: #ff7200;
        }
      }
      &:nth-child(3){
        strong{
          color: #fff;
          background-color: #ffae00;
        }
      }
      strong{
        position: absolute;
        left: -35px;
        top: 50%;
        margin-top: -10px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 50%;
        font-size: 14px;
        color: #666666;
        text-align: center;
        font-weight: normal;
      }
      .blue{
        color: rgb(44, 162, 249);
      }
      h2{
        font-size: 14px;
        line-height: 24px;
        color: #666666;
        font-weight: normal;
      }
      p{
        font-size: 12px;
        line-height: 22px;
        color: #8b8b8b;
      }
      .icon-tianjia1-copy{
        position: absolute;
        right: 12px;
        top: 50%;
        margin-top: -15px;
        font-size: 20px;
        color: #bbb;
      }
      .icon-bofangsanjiaoxing, .icon-pause {
        position: absolute;
        right: 44px;
        top: 50%;
        margin-top: -16px;
        font-size: 20px;
        color: #bbb;
      }
    }
  }
</style>
