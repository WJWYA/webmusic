<template>
  <div class="ranklist-container">
    <h3 class="title">官方榜</h3>
    <div class="official-charts">
      <div class="items">
        <div class="item" v-for="(item,index) in rankList.slice(0,4)" :key="index" @click="toPlayList(item.id)">
          <div class="img-wrap">
            <img :src="item.coverImgUrl"/>
          </div>
          <div class="text">
            <span>查看全部</span>
          </div>
        </div>
       
      </div>
    </div>
  </div>
</template>

<script>

import { ranklist } from '@/api/ranklist';
export default {
    name: 'ranklist',
    data(){
        return{
            //四类排行榜
            rankList:[],
            //歌单id
            id: "",
        }
    },
    created(){
       ranklist().then(res=>{
            console.log(res.list)
            this.rankList = res.list
        
        })
    },

    methods: {
        toPlayList(id){
            console.log(id)
            this.$router.push(`/playlist?id=${id}`)
        }
    },

};
</script>

<style lang="scss">
//排行榜
.ranklist-container {
  
  .title {
    font-weight: normal;
    margin-bottom: 20px;
    padding-left: 8px;
    
  }
  // 推荐音乐
  .official-charts {
    margin-bottom: 40px;
    .items {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 200px;
        margin: 10px;
        position: relative;
        // overflow: hidden;
        background-color: #efca35;
        border-radius: 10px;
        &:hover{
          background-color: #e6be1e;
          cursor: pointer;
        }
        img {
          width: 200px;
          height: 180px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
      .text{
          color: white;
          text-align: center;
      }
      }
      
    }
  }
}

</style>