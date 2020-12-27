<template>
  <div class="index-container" >
    <div class="nav">
      <ul>
        <li>
          <router-link to="/discovery">
            <span class="iconfont icon-find-music"></span>
            发现音乐
          </router-link>
        </li>
        <li>
          <router-link to="/playlists">
            <span class="iconfont icon-music-list"></span>
            推荐歌单
          </router-link>
        </li>
        <li>
          <router-link to="/songs">
            <span class="iconfont icon-music"></span>
            最新音乐
          </router-link>
        </li>
        <li>
          <router-link to="/mvs">
            <span class="iconfont icon-mv"></span>
            最新MV
          </router-link>
        </li>
        <li>
          <router-link to="/ranklist">
            <span class="iconfont icon-_huabanfuben"></span>
            排行榜
          </router-link>
        </li>
      </ul>
      <!-- 歌词部分 -->
      <div class="song-lyric" v-if="isShowLyric">
        <!-- <span>{{currentTime}}</span>
        <span>{{duration}}</span>
        <span>{{allKeys}}</span> -->
        <div
          class="lyric-wrap"
          v-for="(item, name, index) in lyric"
          :key="index"
        >
          <span
            class="lyric"
            v-if="
              currentTime > allKeys[index] && currentTime < allKeys[index + 1]
            "
            >{{ item }}</span
          >
        </div>
        <span class="nolyric" v-if="Object.keys(lyric).length == 0"
          >无歌词</span
        >
      </div>

      <div class="bottom-music-status">
        <img :src="cover" alt="" />
        <div class="music-info">
          <marquee
            ><span class="music-name">{{ name }}</span></marquee
          >
          <span class="music-player">{{ player }}</span>
        </div>
        <div
          class="lyric"
          @click="lyricStatus"
          :class="{ active: !isShowLyric }"
        >
          <span class="iconfont icon-ci"></span>
        </div>
      </div>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
    <!-- 播放列表 -->
    <!-- 播放列表提示按钮 -->
    <div
      class="playing-list-target"
      @click="showplayingList"
      id="playingListTarget"
    >
      <span class="iconfont icon-dongtaijiantoucopy"></span>
      <span>&nbsp;列表</span>
    </div>
    <!-- 列表内容 -->
    <div :class="[playing_list_style]" id="playingList">
      <div class="playing-list-top">
        <span class="iconfont icon-guanbi" @click="closeplayingList"></span>
        <span>播放列表：共{{ playingList.length + 1 }}首</span
        ><el-button type="text" @click="open"
          ><span class="iconfont icon-shanchu"></span
        ></el-button>
      </div>
      <div class="playing-list-bottom">
        <div class="song-info">
          <!-- <span class="iconfont icon-yinle"></span> -->
          <div class="player-wrap">
            <span class="player">王洋</span>
          </div>
          <div class="song-info-left" @click="playMyMusic()">
            <span
              class="songname"
              :class="{
                songnameChange:
                  url ==
                  'https://node.kg.qq.com/cgi/fcgi-bin/fcg_get_play_url?shareid=Z-FyqFZ72XM4FZsz',
              }"
              >燕无歇</span
            >
          </div>
          <!-- <span class="iconfont icon-shanchu"></span> -->
        </div>
        <div
          class="song-info"
          v-for="(item, index) in playingList"
          :key="index"
        >
          <div class="player-wrap">
            <span class="player">{{ item[2] }}</span>
          </div>
          <div class="song-info-left" @click="playMusic(item)">
            <span
              class="songname"
              :class="{ songnameChange: url == item[3] }"
              >{{ item[1] }}</span
            >
          </div>

          <span class="iconfont icon-shanchu" @click="deleteSong(index)"></span>
        </div>
      </div>
    </div>
    <div class="player">
      <audio
        ref="audio_player"
        class="audio"
        controls
        autoplay
        :src="url"
        loop
        @timeupdate="updateCurrentTiem"
        @canplay="getDuration"
      ></audio>
    </div>
  </div>
</template>

<script>
import { songLyric } from "@/api/discovery";
export default {
  name: "index",
  data() {
    return {
      activeIndex: 0,
      url:
        "https://node.kg.qq.com/cgi/fcgi-bin/fcg_get_play_url?shareid=Z-FyqFZ72XM4FZsz",
      cover:
        "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1557884870,2359719609&fm=11&gp=0.jpg",
      name: "燕无歇",
      player: "王洋",
      currentTime: "",
      duration: "",
      lyric: {},
      allKeys: [],
      isShowLyric: true,
      isShowplayingList: true,
      playing_list_style: "playing-list-box",
      // playingList: [["","燕无歇","王洋(cover 七叔)","https://node.kg.qq.com/cgi/fcgi-bin/fcg_get_play_url?shareid=Z-FyqFZ72XM4FZsz","https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1557884870,2359719609&fm=11&gp=0.jpg"]],
      playingList: [],
      lrcs: {},
    };
  },
  watch: {
    //改变列表播放样式，:class动态绑定即可
    // url() {
    //   console.log(this.url)
    //   this.changPlayingSongsStyle();
    // },
  },
  mounted() {},
  methods: {
    //默认音乐
    defaultMusic() {
      this.url =
        "https://node.kg.qq.com/cgi/fcgi-bin/fcg_get_play_url?shareid=Z-FyqFZ72XM4FZsz";
      this.cover =
        "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1557884870,2359719609&fm=11&gp=0.jpg";
      this.name = "燕无歇";
      this.player = "王洋";
      this.lrcs = {};
      this.lyric = this.lrcs;
    },

    //确认弹窗
    open() {
      this.$confirm("此操作将清空播放列表(除《燕无歇》外), 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "播放列表已清空!",
          });
          this.deleteSongs();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    //删除单首歌曲
    deleteSong(index) {
      // console.log(index);
      // console.log(this.playingList.length);
      // console.log(this.playingList)
      if (this.url == this.playingList[index][3] && index > 0) {
        this.url = this.playingList[index - 1][3];
        this.cover = this.playingList[index - 1][4];
        this.name = this.playingList[index - 1][1];
        this.player = this.playingList[index - 1][2];
      }
      if (this.url == this.playingList[0][3] && index == 0) {
        this.defaultMusic();
      }
      this.playingList.splice(index, 1);
    },
    //清空播放列表
    deleteSongs() {
      this.playingList = [];
      this.defaultMusic();
    },

    //点击触发播放列表
    closeplayingList1(event) {
      var currentCli = document.getElementById("playingList");
      var playingListTarget = document.getElementById("playingListTarget");
      if (currentCli && playingListTarget) {
        if (
          !currentCli.contains(event.target) &&
          !playingListTarget.contains(event.target)
        ) {
          //点击到了id为sellineName以外的区域，隐藏下拉框
          this.playing_list_style = "playing-list-box";
        }
      }
    },
    //鼠标移出触发播放列表
    closeplayingList() {
      this.playing_list_style = "playing-list-box";
    },
    showplayingList() {
      this.playing_list_style = "playing-list-box-change";
    },
    lyricStatus() {
      this.isShowLyric = !this.isShowLyric;
    },
    pauseMusic() {
      let audio = document.querySelector("audio");

      audio.pause();
    },
    //获取歌曲当前播放时间
    updateCurrentTiem(e) {
      this.currentTime = e.target.currentTime;
      // console.log(this.currentTime)
    },
    //获取歌曲总时长
    getDuration() {
      this.duration = document.querySelector("audio").duration;
      // console.log(this.duration);
    },
    playMyMusic() {
      this.defaultMusic();
      this.lrcs = {};
      this.lyric = {};
      // this.changPlayingSongsStyle();
    },
    playMusic(item) {
      this.url = item[3];
      this.cover = item[4];
      this.name = item[1];
      this.player = item[2];
      //  切换正在播放的歌曲的style
      // this.changPlayingSongsStyle();
      songLyric({
        id: item[0],
      }).then((res) => {
        // console.log(res.lrc.lyric);
        if (res.nolyric) {
          // console.log("没有歌词");
          this.lrcs = {};
          this.lyric = this.lrcs;
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
      this.lyric = this.lrcs;
    },
    getAllkeys(lrc) {
      this.allKeys = [];
      for (let key in lrc) {
        this.allKeys.push(key);
      }
    },
    // changPlayingSongsStyle() {
    //   let playingSong = document.getElementsByClassName("songnameChange");
    //   // console.log(playingSong);
    //   playingSong[0].className = "songname";
    //   // console.log(playingSong);

    //   let songUrlList = document.getElementsByClassName("songUrl");
    //   console.log(songUrlList.length);
    //   console.log(songUrlList);
    //   console.log("======");
    //   let playinglist = document.getElementsByClassName("songname");
    //   // console.log(playinglist);
    //   console.log(songUrlList.length);

    //   for (let i = 0; i < songUrlList.length; i++) {
    //     console.log(songUrlList[i])
    //     let songurl = songUrlList[i].innerHTML;

    //     console.log(playinglist[i]);

    //     if (this.url == songurl) {
    //       playinglist[i].className = "songnameChange";
    //     }
    //   }
    //   // console.log("-------");
    //   // console.log(this.url);
    // },
  },
};
</script>

<style lang="scss">
.playing-list-target {
  width: 100px;
  height: 50px;
  background-color: #ebc119;
  border-radius: 50px;
  position: fixed;
  top: 50%;
  right: -50px;
  line-height: 50px;
  padding-left: 30px;
  cursor: pointer;
  color: white;
  &:hover {
    padding-left: 5px;
  }
  &:active {
    right: -20px;
  }
  :nth-child(2) {
    font-size: 12px;
  }
}
.playing-list-box {
  background-color: #565a5d;

  color: white;
  position: fixed;
  width: 300px;
  right: -305px;
  height: 100%;
  z-index: 999;

  padding-bottom: 170px;
  font-family: "Microsoft YaHei";
}
.playing-list-box-change {
  background-color: #565a5d;

  color: white;
  position: fixed;
  width: 300px;
  right: -10px;
  height: 100%;
  z-index: 999;
  padding-bottom: 170px;
  font-family: "Microsoft YaHei";
}
.playing-list-top {
  font-size: 20px;
  padding-left: 5px;
  height: 50px;
  line-height: 50px;
  border-bottom: 2px solid white;
  :nth-child(1) {
    color: #ebc119;
    margin-right: 10px;
  }
  :nth-child(3) {
    position: absolute;
    right: 20px;
    top:5px;
  }
}
.playing-list-bottom {
  overflow-y: scroll;
  height: 100%;
  .song-info {
    padding-left: 5px;
    padding-right: 5px;
    height: 30px;

    line-height: 30px;

    display: flex;
    &:hover {
      background-color: #856b07;
    }
    &:hover .song-info-left {
      background-color: #856b07;
    }
    &:hover .player {
      background-color: aqua;
      left: -100px;
      color: white;
    }
    .icon-yinle {
      height: 30px;
      margin-right: 10px;
      color: #efca35;
    }
    .song-info-left {
      cursor: pointer;
      overflow: hidden;
      width: 200px;
      position: absolute;
      left: 5px;
      z-index: 10000px;
      height: 30px;
      background-color: #565a5d;
    }
    .song-info-left:hover .player {
      background-color: aqua;
    }
    .player-wrap {
      height: 30px;
      width: 100px;
      position: absolute;
      // left: 5px;

      right: 195px;
      .player {
        text-align: center;
        position: absolute;
        color: white;
        height: 30px;
        background-color: #ebc119;
        z-index: -1;
        overflow: hidden;
      }
    }
    .songname {
      color: white;
      max-width: 230px;
      overflow: hidden;
      display: block;
    }
    .songnameChange {
      color: #efca35;
    }
    .icon-shanchu {
      position: absolute;
      right: 20px;
    }
  }
}

.song-lyric {
  position: absolute;
  bottom: 120px;
  width: 200px;
  height: 120px;
  // background-color: aqua;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
  .lyric-wrap {
    // background-color: beige;
    text-align: center;

    span {
      color: #ebc119;
    }
  }
  .nolyric {
    color: #ebc119;
  }
}

.bottom-music-status {
  position: absolute;
  bottom: 60px;
  width: 200px;
  height: 60px;
  background-color: aliceblue;
  display: flex;

  img {
    width: 60px;
    height: 60px;
  }
  .music-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px;
    width: 100%;

    .music-name {
      font-size: 15px;
      width: 100%;
      text-align: center;
      line-height: 30px;
      max-height: 50px;

      overflow: hidden;
    }
    .music-player {
      margin-top: 5px;
      transform: scale(0.83);
      font-size: 12px;
    }
  }
  .lyric {
    cursor: pointer;
    color: #ebc119;
    position: absolute;
    bottom: 5px;
    right: 5px;
    &.active {
      color: rgb(140, 143, 143);
    }
  }
}
</style>
