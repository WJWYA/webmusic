<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img :src="coverImgUrl" alt="" />
      </div>
      <div class="info-wrap">
        <p class="title">{{ title }}</p>
        <div class="author-wrap">
          <img class="avatar" :src="avatarUrl" alt="" />
          <span class="name">{{ nickname }}</span>
          <span class="time">{{ createTime }} 创建</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul>
            <li v-for="item in tags" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{ signature }}</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
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
                  <img :src="item.al.picUrl" alt="" />
                  <span class="iconfont icon-play"></span>
                </div>
              </td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <span>{{ item.name }}</span>
                    <!-- mv图标 -->
                    <span
                      v-if="item.mv != 0"
                      @click="toMV(item.mv)"
                      class="iconfont icon-mv"
                    ></span>
                  </div>
                  <span>{{ item.subTitle }}</span>
                </div>
              </td>
              <td>{{ item.ar[0].name }}</td>
              <td>
                {{ item.al.name }}
              </td>
              <td>{{ item.dt | formatDuration }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane :label="`评论(${total + hotComments.length})`" name="2">
        <!-- 热门评论 -->
        <div v-if="hotComments.length != 0" class="comment-wrap">
          <p class="title">
            热门评论<span class="number">({{ hotComments.length }})</span>
          </p>
          <div
            class="comments-wrap"
            v-for="item in hotComments"
            :key="item.commentId"
          >
            <div class="item">
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.user.nickname }}：</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <div v-if="item.beReplied.length != 0" class="re-content">
                  <span class="name"
                    >{{ item.beReplied[0].user.nickname }}：</span
                  >
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <div class="date">{{ item.time | formatTime }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论 -->
        <div class="comment-wrap">
          <p class="title">
            最新评论<span class="number">({{ total }})</span>
          </p>
          <div v-if="comments.length != 0" class="comments-wrap">
            <div class="item" v-for="item in comments" :key="item.commentId">
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.user.nickname }}：</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <div v-if="item.beReplied.length != 0" class="re-content">
                  <span class="name"
                    >{{ item.beReplied[0].user.nickname }}：</span
                  >
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <div class="date">{{ item.time | formatTime }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="page"
          :page-size="5"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { playlistDetail, listComments, hotComments } from "@/api/playlist";
import { songUrl, songLyric } from "@/api/discovery";
import moment from "moment";
export default {
  name: "playlist",
  data() {
    return {
      activeIndex: "1",
      tableData: [],
      title: "",
      avatarUrl: "",
      coverImgUrl: "",
      signature: "",
      nickname: "",
      tags: [],
      createTime: "",
      // 热门评论
      hotComments: [],
      // 普通评论
      comments: [],
      // 分页相关数据
      // 每页数据
      limit: 20,
      // 页码
      page: 1,
      // 总条数
      total: 0,
      //歌词
      lrcs: [],
      allKeys: [],
    };
  },
  filters: {},
  created() {
    const { id } = this.$route.query;
    playlistDetail({
      id,
    }).then((res) => {
      // window.console.log(res)
      // 歌曲信息
      this.tableData = res.playlist.tracks;
      this.title = res.playlist.name;
      this.avatarUrl = res.playlist.creator.avatarUrl;
      this.coverImgUrl = res.playlist.coverImgUrl;
      this.signature = res.playlist.creator.signature;
      this.nickname = res.playlist.creator.nickname;
      this.tags = res.playlist.tags;
      this.createTime = moment(res.playlist.createTime).format("YYYY-MM-DD");
    });
    // 获取热门评论
    hotComments({
      id,
    }).then((res) => {
      this.hotComments = res.hotComments;
    });

    // 获取评论信息
    this.getComments();
  },
  methods: {
    toMV(id) {
      this.$router.push(`/mv?id=${id}`);
      this.$parent.pauseMusic();
    },
    // 获取歌曲评论
    getComments() {
      const { id } = this.$route.query;
      // 获取歌曲评论
      listComments({
        id,
        offset: (this.page - 1) * 5,
      }).then((res) => {
        this.total = res.total;
        this.comments = res.comments;
      });
    },
    // 页码改变
    handleCurrentChange(val) {
      this.page = val;
      this.getComments();
    },
    playMusic(item) {
      songUrl({
        id: item.id,
      }).then((res) => {
        // window.console.log(item);
        // this.songUrl = res.data[0].url
        this.$parent.url = res.data[0].url;

        this.$parent.cover = item.al.picUrl;
        this.$parent.name = item.name;
        this.$parent.player = item.ar[0].name;
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
};
</script>

<style lang="scss"></style>
