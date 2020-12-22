<template>
  <div class="discovery-container">
    <!-- 轮播图 -->
    <el-carousel class="" :interval="4000" type="card">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <img :src="item.imageUrl" alt="" />
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">推荐歌单</h3>
      <div class="items">
        <div class="item" v-for="item in playList" :key="item.id">
          <div class="img-wrap" @click="toPlayList(item.id)">
            <div class="desc-wrap">
              <span class="desc">{{ item.copywriter }}</span>
            </div>
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play"></span>
          </div>
          <p class="name">{{ item.name }}</p>
        </div>
      </div>
    </div>
    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">最新音乐</h3>
      <div class="items">
        <div class="item" v-for="(item, index) in newsong" :key="index">
          <div class="img-wrap">
            <img :src="item.picUrl" alt="" />
            <span @click="playMusic(item)" class="iconfont icon-play"></span>
          </div>
          <div class="song-wrap">
            <div class="song-name">{{ item.name }}</div>
            <div class="singer">{{ item.song.artists[0].name }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <div class="items">
        <div class="item" v-for="item in mv" :key="item.id">
          <div class="img-wrap" @click="toMv(item.id)">
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-play"></span>
            <div class="num-wrap">
              <div class="iconfont icon-play"></div>
              <div class="num">{{ item.playCount }}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{ item.copywriter }}</div>
            <div class="singer">{{ item.artistName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  banner,
  songlist,
  newsong,
  mv,
  songUrl,
  songLyric,
} from "@/api/discovery";
// import { getly } from "@/utils/getLyric";
export default {
  name: "discovery",
  data() {
    return {
      // 轮播图
      banners: [],
      // 歌单
      playList: [],
      // 新歌
      newsong: [],
      // mv
      mv: [],
      // 歌曲url
      songUrl: "",
      isPlaying: true,
      //歌词
      lrcs: [],
      allKeys: [],
    };
  },
  created() {
    banner().then((res) => {
      this.banners = res.banners;
    });
    songlist().then((res) => {
      // window.console.log(res)
      this.playList = res.result;
    });
    newsong().then((res) => {
      this.newsong = res.result;
    });
    mv().then((res) => {
      this.mv = res.result;
    });
  },
  methods: {
    //添加音乐到播放列表
    addToPlayList(item,res){
      for (let i = 0; i < this.$parent.playingList.length; i++) {
          if(item.id == this.$parent.playingList[i][0]){
            // console.log(item.id)
            this.$parent.playingList.splice(i,1)
            break
          }
          
          
        }
        this.$parent.playingList.push([item.id,item.name,item.song.artists[0].name,res.data[0].url,item.picUrl,])
    },
    toMv(id) {
      this.$parent.pauseMusic();

      this.$router.push(`/mv?id=${id}`);
    },
    toPlayList(id) {
      this.$router.push(`/playlist?id=${id}`);
    },
    playMusic(item) {
      songUrl({
        id: item.id,
      }).then((res) => {
        this.addToPlayList(item,res)
        // for (let i = 0; i < this.$parent.playingList.length; i++) {
        //   if(item.id == this.$parent.playingList[i][0]){
        //     // console.log(item.id)
        //     this.$parent.playingList.splice(i,1)
        //     break
        //   }
          
          
        // }
        // this.$parent.playingList.push([item.id,item.name,item.song.artists[0].name,res.data[0].url,item.picUrl,])
        // console.log(item)
        this.$parent.url = res.data[0].url;
        this.$parent.cover = item.picUrl;
        this.$parent.name = item.name;
        this.$parent.player = item.song.artists[0].name;
      }),
        songLyric({
          id: item.id,
        }).then((res) => {
          // console.log(res.lrc.lyric);
          if (res.nolyric) {
            // console.log("没有歌词");
            this.lrcs = {}
            this.$parent.lyric = this.lrcs;
          } else {
            // console.log("有歌词");
            this.getly(res.lrc.lyric);
          }
        });
     
    },
    getly(lyric) {
      let lylines = lyric.split("\n");
      let pattern = /\[\d{2}:\d{2}.\d*\]/g;
      let result = {};

      for (let i = 0; i < lylines.length; i++) {
        //保存歌词时间
        let timeRegArr = lylines[i].match(pattern);
        if (!timeRegArr) continue; //跳过null
        // console.log(timeRegArr);

        //获取时间
        let t = timeRegArr[0];
        // 正则匹配
        let min = parseInt(t.match(/\[\d*/i).toString().slice(1));
        let sec = parseInt(t.match(/:\d*/i).toString().slice(1));

        let time = min * 60 + sec;

        //获取歌词,把时间替换为空，后面的歌词赋给content
        let content = lylines[i].replace(timeRegArr, "");
        // console.log(content);
        result[time] = content;
        // console.log(result)
      }
      this.lrcs = result;
      this.getAllkeys(this.lrcs);
      // console.log(lylines);

      // console.log(this.lrcs);
      this.$parent.lyric = this.lrcs;
    },
    getAllkeys(lrc) {
      this.allKeys = [];
      for (let key in lrc) {
        this.allKeys.push(key);
      }
      this.$parent.allKeys = this.allKeys;
    },
  },
};
</script>

<style lang="scss">
</style>
