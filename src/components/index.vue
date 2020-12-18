<template>
  <div class="index-container">
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
        <span class="nolyric" v-if="Object.keys(lyric).length == 0">无歌词</span>
      </div>

      <div class="bottom-music-status">
        <img :src="cover" alt="" />
        <div class="music-info">
          <span class="music-name">{{ name }}</span>
          <span class="music-player">{{ player }}</span>
        </div>
        <div class="lyric" @click="lyricStatus" :class=" {active: !isShowLyric}"><span class="iconfont icon-ci"></span></div>
      </div>
    </div>
    <div class="main">
      <router-view></router-view>
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
      isShowLyric:true,
    };
  },
  // mounted() {
  //   let audio = document.querySelector("audio");

  // },
  methods: {
    lyricStatus(){
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
      console.log(this.duration);
    },

    // addEventHandele(){
    //   let audio = document.querySelector("audio");
    //   audio.addEventListener("timeupdate",()=>{
    //       this.currentTime = audio.currentTime
    //   })
    //   audio.addEventListener("canplay",()=>{
    //     this.duration = audio.duration
    //   })
    // }
  },
};
</script>

<style lang="scss">
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
  .nolyric{
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
      font-size: 12px;
    }
    .music-player {
      margin-top: 5px;
      transform: scale(0.83);
      font-size: 12px;
    }
  }
  .lyric{
    cursor: pointer;
    color: #ebc119;
    position: absolute;
    bottom:5px;
    right: 5px;
    &.active{
      color: rgb(140, 143, 143);
    }
  }
}
</style>
