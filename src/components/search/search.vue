<template>
  <div class="fullScreen">
    <div style="height: 46px">
      <search
        @on-submit="onSubmit"
        @on-change="schChange"
        class="search-sch"
        placeholder="歌曲/歌手"
        v-model="value"
        auto-scroll-to-top
        ref="search">
        <div slot="left" @click="$router.go(-1)">
          <x-icon class="search-sch-back" type="ios-arrow-left" size="28"></x-icon>
        </div>
      </search>
    </div>
    <scroller lock-x :scrollbar-y=true ref="searchScroll" @on-scroll-bottom="onScrollBottom" :scroll-bottom-offset="0" height="-106">
      <div>
        <div class="search-box" v-if="showSch">
          <dl class="hotSch">
            <dt>热门搜索</dt>
            <dd><span v-for="item in hotSch" @click="onSubmit(item.keyword)">{{item.keyword}}</span></dd>
          </dl>
          <div class="historySch" v-if="historySch.length">
            <ul>
              <li v-for="(item,index) in historySch" v-if="index<10"><p @click="onSubmit(item)"><i class="iconfont icon-lishi"></i>{{item}}</p><i class="iconfont icon-chuyidong" @click="removeHistorySch(index)"></i></li>
            </ul>
            <a @click="removeAllHistorySch">清空搜索历史</a>
          </div>
        </div>

        <div v-if="!showSch">
          <div class="search-result vux-1px-b">搜索结果<strong>{{this.totalSongs}}</strong>条</div>
          <song-list></song-list>
          <div style="overflow: hidden;">
            <load-more style="margin: 20px auto 0" :show-loading="loadShow" :tip="loadTip"></load-more>
          </div>
        </div>
      </div>
    </scroller>
   <!--
      @on-focus="onFocus"
      -->
  </div>
</template>

<script>
  import send from '@/service/getData.js'
  import { mapActions } from 'vuex'
  import { Search, Scroller, LoadMore } from 'vux'
  import songList from '@/components/Moudle/songList/songList'
  export default {
    components: {
      Search,
      Scroller,
      songList,
      LoadMore
    },
    created () {
      send.getHotSearch().then((res) => {
        this.hotSch = res.data.data.info
        this.$store.commit('updateLoadingStatus', {isLoading: false})
      })
      if (localStorage.getItem('kugouHistorySch')) {
        this.historySch = localStorage.getItem('kugouHistorySch').split(',').reverse()
      }
    },
    data () {
      return {
        value: '',
        hotSch: [],
        historySch: [],
        showSch: true,

        totalSongs: 0,

        page: 1,
        totalPage: 1,
        status: true,
        loadTip: '正在加载',
        loadShow: true
      }
    },
    methods: {
      ...mapActions({
        updateList: 'updateList',
        addList: 'addList'
      }),
      onScrollBottom () {
        if (!this.showSch) {
          if (this.status && this.page < this.totalPage) {
            this.status = false
            this.page++
            send.getSongSearch({
              format: 'json',
              keyword: this.value,
              page: this.page,
              pagesize: 20
            }).then((res) => {
              this.addList(res.data.data.info).then(() => {
                this.$refs.searchScroll.reset()
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
      onSubmit (value) {
        if (value) {
          this.value = value
        }
        if (this.historySch.indexOf(this.value) === -1) {
          localStorage.setItem('kugouHistorySch', localStorage.getItem('kugouHistorySch') ? localStorage.getItem('kugouHistorySch') + ',' + this.value : this.value)
          this.historySch.unshift(this.value)
        }
        this.page = 1
        this.loadTip = '正在加载'
        this.loadShow = true
        send.getSongSearch({
          format: 'json',
          keyword: this.value,
          page: this.page,
          pagesize: 20
        }).then((res) => {
          this.updateList(res.data.data.info)
          this.totalSongs = res.data.data.total
          this.totalPage = Math.ceil(res.data.data.total / 20)
          if (this.totalPage === 1) {
            this.loadTip = '我是有底线的'
            this.loadShow = false
          }
          this.showSch = false
        })
      },
      removeAllHistorySch () {
        let that = this
        this.$vux.confirm.show({
          content: '确定清空搜索历史？',
          onConfirm () {
            that.historySch = []
            localStorage.removeItem('kugouHistorySch')
          }
        })
      },
      removeHistorySch (index) {
        if (this.historySch.length) {
          this.historySch.splice(index, 1)
          localStorage.setItem('kugouHistorySch', this.historySch.toString())
        }
      },
      schChange () {
        if (!this.value.length) {
          this.showSch = true
          this.$refs.searchScroll.reset({
            top: 0
          })
        }
      }
    }
  }
</script>

<style lang="less">
  .fullScreen{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    background-color: #fff;
    z-index: 101;
  }
  .search-sch{
    .weui-search-bar{
      padding: 9px 10px;
      background-color: rgb(44, 162, 249);
      .weui-search-bar__form{
        background-color: rgb(44, 162, 249);
      }
      .weui-search-bar__cancel-btn{
        color: #ffffff;
      }
      .weui-search-bar__label span{
        vertical-align: baseline;
      }
    }
    .search-sch-back{
      fill:#fff;
      height: 26px;
      vertical-align: middle;
      margin-top: -2px;
    }
  }
  .search-box{
    .hotSch{
      padding: 0 18px 10px;
      dt{
        height: 37px;
        line-height: 37px;
        font-size: 14px;
        color: #929292;
      }
      dd{
        height: 66px;
        overflow: hidden;
        span{
          display: inline-block;
          margin-right: 5px;
          margin-bottom: 5px;
          border: #adadad 1px solid;
          padding: 0 9px;
          height: 26px;
          line-height: 26px;
          font-size: 12px;
          border-radius: 30px;
        }
      }
    }
    .historySch{
      ul{
        padding-left: 18px;
        border-top: #f1f1f1 1px solid;
        border-bottom: #f1f1f1 1px solid;
        li{
          padding-right: 50px;
          height: 46px;
          line-height: 46px;
          border-top: #f1f1f1 1px solid;
          font-size: 14px;
          position: relative;
          &:first-child{
            border-top: none;
          }
          .icon-lishi{
            vertical-align: middle;
            font-size: 18px;
            margin-right: 10px;
            color: #6c6c6c;
          }
          .icon-chuyidong{
            position: absolute;
            top: 0;
            right: 18px;
            color: #d0d0d0;
            padding-top: 2px;
            line-height: 44px;
          }
        }
      }
      a{
        display: block;
        padding: 15px 0;
        text-align: center;
        font-size: 16px;
        color: rgb(44, 162, 249);
      }
    }
  }
  .weui-dialog__btn_primary{
    color: rgb(44, 162, 249);
  }
  .search-result{
    padding: 0 15px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    strong{
      font-weight: normal;
      color: rgb(44, 162, 249);
    }
  }
</style>
