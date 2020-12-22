<template>
  <div class="songs-container" >
    <div class="tab-bar">
      <span class="item" :class="{ active: type == 0 }" @click="type = 0"
        >全部</span
      >
      <span class="item" :class="{ active: type == 7 }" @click="type = 7"
        >华语</span
      >
      <span class="item" :class="{ active: type == 96 }" @click="type = 96"
        >欧美</span
      >
      <span class="item" :class="{ active: type == 8 }" @click="type = 8"
        >日本</span
      >
      <span class="item" :class="{ active: type == 16 }" @click="type = 16"
        >韩国</span
      >
    </div>
    <!-- 底部的table -->
    <table class="el-table playlit-table">
      <thead>
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody>
        <tr
          class="el-table__row"
          v-for="(item, index) in tableData"
          :key="item.id"
        >
          <td>{{ index + 1 }}</td>
          <td>
            <div class="img-wrap" @click="playMusic(item)">
              <img :src="item.album.picUrl" alt="" />
              <span  class="iconfont icon-play" ></span>
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{ item.name }}</span>
                <span v-if="item.mvid != 0" class="iconfont icon-mv" @click='toMV(item.mvid)'></span>
              </div>
              <span>{{ item.subTitle }}</span>
            </div>
          </td>
          <td>{{ item.artists[0].name }}</td>
          <td>
            {{ item.album.name }}
          </td>
          <td>{{ item.duration | formatDuration }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { topSongs } from '@/api/songs';
import { songUrl,songLyric } from '@/api/discovery';
export default {
  name: 'songs',
  data() {
    return {
      type: 0,
      tableData: [],
      lrcs: [],
      allKeys: [],
    
    };
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
        this.$parent.playingList.push([item.id,item.name,item.artists[0].name,res.data[0].url,item.album.picUrl])
    },
    toMV(id){
      this.$router.push(`/mv?id=${id}`)
      this.$parent.pauseMusic();
    },
    getData() {
      topSongs({
        type: this.type
      }).then(res => {
        this.tableData = res.data;
      });
    },
    playMusic(item) {
      songUrl({
        id: item.id
      }).then(res => {
        // window.console.log(res)
        // this.songUrl = res.data[0].url
        this.addToPlayList(item,res)
        this.$parent.url = res.data[0].url;

        this.$parent.cover = item.album.picUrl
        this.$parent.name = item.name
        this.$parent.player = item.artists[0].name
      }),
      songLyric({
          id: item.id,
        }).then((res) => {
          console.log(res);
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
  watch: {
    type() {
      this.getData();
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang="scss"></style>
