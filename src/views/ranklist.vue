<template>
  <div class="ranklist-container">
    <h3 class="title">官方榜</h3>
    <div class="rank-list">
      <div class="items">
        <div
          class="item"
          v-for="(item, index) in rankList.slice(0, 4)"
          :key="index"
          @click="toPlayList(item.id)"
        >
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{ item.updateFrequency }}</span>
            </div>
            <img :src="item.coverImgUrl" />
          </div>
          <div class="updateTime">
            <span class="time">{{ item.updateTime | formattime }}更新</span>
          </div>
          <div class="text">
            <span>查看全部</span>
          </div>
        </div>
      </div>
    </div>
    <h3 class="title">全球榜</h3>
    <div class="rank-list">
      <div class="items">
        <div
          class="item"
          v-for="(item, index) in rankList.slice(4)"
          :key="index"
          @click="toPlayList(item.id)"
        >
          <div class="img-wrap">
            <div class="playcount-wrap">
              <span class="iconfont icon-play"></span>
              <span class="playcount">{{ item.playCount | formatCount }}</span>
            </div>
            <img :src="item.coverImgUrl" />
            <span class="iconfont icon-play"></span>
          </div>
          <div class="text">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import { ranklist } from "@/api/ranklist";
export default {
  name: "ranklist",
  data() {
    return {
      //排行榜
      rankList: [],
      //歌单id
      id: "",
    };
  },
  created() {
    ranklist().then((res) => {
      console.log(res.list);
      this.rankList = res.list;
    });
  },

  methods: {
    toPlayList(id) {
      console.log(id);
      this.$router.push(`/playlist?id=${id}`);
    },
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
  // 排行榜列表
  .rank-list {
    margin-bottom: 40px;
    .items {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 200px;
        margin: 10px;
        position: relative;
        overflow: hidden;
        background-color: #efca35;
        border-radius: 10px;
        &:hover {
          background-color: #e7bd16;
          cursor: pointer;
        }
        .desc-wrap {
          position: absolute;
          width: 100%;
          top: -100%;
          left: 0;
          max-height: 50px;
          overflow: hidden;
          font-size: 16px;
          color: white;
          background: rgba(0, 0, 0, 0.5);
           
          padding: 5px;
          
          // text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          
          span {
            font-size: 16px;
          }
        }
        &:hover .desc-wrap {
          top: 0;
        }
        .updateTime {
          position: absolute;
          font-size: 15px;
          color: white;
          top: 60%;
          width: 100%;
          text-align: center;
        }
        .playcount-wrap {
          position: absolute;
          top: 0px;
          display: flex;
          justify-content: flex-end;
          width: 100%;
          background-image: linear-gradient(
            to top,
            rgba(168, 165, 165, 0),
            rgba(168, 165, 165, 0.401)
          );
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          padding-top: 5px;
          .icon-play {
            position: relative;
            top: 10px;
            left: 30px;
            font-size: 15px;
            color: white;
            opacity: 1;
            background: rgba(255, 255, 255, 0);
          }
          span {
            margin-right: 5px;
            color: white;
          }
        }
        img {
          width: 200px;
          height: 180px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
        .icon-play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          color: #efca35;
          font-size: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.8);
          opacity: 0;
          &::before {
            transform: translateX(3px);
          }
        }
        &:hover .icon-play {
          opacity: 1;
        }
        .text {
          color: white;
          text-align: center;
        }
      }
    }
  }
}
</style>