<template>
    <sticky scrollBox="vux_view_box_body" :check-sticky-support="false" :offset="46">
      <tab :line-width=2 active-color="#2ca2f9" defaultColor="#333333">
        <tab-item :selected="tabsSelet(item.toPath)"  v-for="(item, index) in tabs" :key="index" @on-item-click="handler(item.toPath)">
          {{item.name}}
        </tab-item>
      </tab>
    </sticky>
</template>

<script>
  import { Tab, TabItem, Sticky } from 'vux'
  export default {
    components: {
      Tab,
      TabItem,
      Sticky
    },
    data () {
      return {
        tabs: [
          {
            name: '新歌',
            toPath: '/'
          },
          {
            name: '排行',
            toPath: '/rank'
          },
          {
            name: '歌单',
            toPath: '/songMenu'
          },
          {
            name: '歌手',
            toPath: '/singerClassify'
          }
        ]
      }
    },
    methods: {
      tabsSelet (toPath) {
        if (this.$route.path && toPath === this.$route.path) {
          return true
        } else {
          return false
        }
      },
      handler (pa) {
        this.$router.push(pa)
      }
    }
  }
</script>

<style lang="less">
</style>
