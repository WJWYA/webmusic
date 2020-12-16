<template>
  <div class="index-container">
    <div class="nav" >
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
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
    <div class="player">
      <audio class="audio" controls autoplay :src="url" loop></audio>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      activeIndex: 0,
      url:"https://node.kg.qq.com/cgi/fcgi-bin/fcg_get_play_url?shareid=Z-FyqFZ72XM4FZsz"
    };
  },
  methods:{
    pauseMusic(){
      let audio = document.querySelector('audio');
      
      audio.pause();
    }
  }
};
</script>

<style lang="scss">

</style>
