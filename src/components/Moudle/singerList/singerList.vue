<template>
  <ul class="singer-list">
    <li v-for="(item,index) in singer">
      <router-link :to="{name:'singerInfo',query:{singerid:item.singerid}}">
        <span>{{index+1}}</span>
        <img :src="item.imgurl.replace('{size}',koGouSize)" alt="">
        {{item.singername}}
        <x-icon class="arrow-right" type="ios-arrow-right" size="24"></x-icon>
      </router-link>
    </li>
  </ul>
</template>

<script>
  import {mapState} from 'vuex'
  import {XImg} from 'vux'
  export default {
    components: {
      XImg
    },
    computed: {
      ...mapState({
        singer: state => state.singerList.singer,
        koGouSize: state => state.koGouSize
      })
    }
  }
</script>

<style lang="less">
  .singer-list{
    li{
      position: relative;
      padding: 8px 48px 8px 19px;
      font-size: 16px;
      line-height: 48px;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      a{
        display: block;
        color: rgb(51, 51, 51);
      }
      &:nth-child(1){
        span{
          color: #fff;
          background-color: #e80000;
        }
      }
      &:nth-child(2){
        span{
          color: #fff;
          background-color: #ff7200;
        }
      }
      &:nth-child(3){
        span{
          color: #fff;
          background-color: #ffae00;
        }
      }
      span{
        display: inline-block;
        width: 18px;
        height: 18px;
        line-height: 18px;
        font-size: 14px;
        text-align: center;
        border-radius: 50%;
      }
      img{
        margin: 0 12px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        vertical-align: middle;
      }
      .arrow-right{
        vertical-align: middle;
        position: absolute;
        right: 19px;
        margin-top: 12px;
        fill: #ccc;
      }
    }
  }
</style>
