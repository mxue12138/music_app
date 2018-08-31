<template>
  <mu-container id="index">
    <div class="top clearfix">
      <mu-flex class="text">
        <mu-text-field placeholder="请输入您要搜索的歌曲或歌手" full-width v-model="searchText" @keyup.enter="search"></mu-text-field>
        <mu-button flat color="primary" @click="search">
          <mu-icon value="search"></mu-icon>
          搜索
        </mu-button>
      </mu-flex>
      <mu-flex class="option" justify-content="center">
        <mu-radio v-model="searchOption" value="netease" label="网易"></mu-radio>
        <mu-radio v-model="searchOption" value="kugou" label="酷狗"></mu-radio>
        <mu-radio v-model="searchOption" value="xiami" label="虾米"></mu-radio>
        <mu-radio v-model="searchOption" value="tencent" label="腾讯"></mu-radio>
        <mu-radio v-model="searchOption" value="baidu" label="百度"></mu-radio>
      </mu-flex>
    </div>
    <div class="list" v-if="searchList != ''" :class="{ bottom: showPlayer && searchList }">
      <mu-load-more :loading="loading" @load="load" :loaded-all="loadAll">
        <mu-list :dense="true">
          <template v-for="(item, index) in searchList">
            <mu-divider></mu-divider>
             <mu-list-item avatar :ripple="false" button @click="getInfo(index)">
              <mu-list-item-content>
                <mu-list-item-title>{{ item.name }}</mu-list-item-title>
                <mu-list-item-sub-title>
                  {{ item.artist.join('、') }}
                  <span v-show="item.album">&nbsp;-&nbsp;《{{ item.album }}》</span>
                </mu-list-item-sub-title>
              </mu-list-item-content>
              <mu-list-item-action @click.stop="getInfo(index)">
                <mu-icon v-if="item.id == searchInfo.id && isPlayer" value="pause_circle_outline"></mu-icon>
                <mu-icon v-else value="play_circle_outline"></mu-icon>
              </mu-list-item-action>
              <mu-list-item-action @click.stop="download(index)">
                <mu-icon value="arrow_downward"></mu-icon>
              </mu-list-item-action>
            </mu-list-item>
          </template>
        </mu-list>
      </mu-load-more>
    </div>
    <transition name="palyer">
      <div v-if="showPlayer" class="palyer" @click="playPage">
        <audio :src="searchInfo.url" autoplay ref="music_player"></audio>
        <img ref="music_img" v-show="searchInfo.pic_url && isImg" :src="searchInfo.pic_url" class="pic" :class="{ paused: !isPlayer && isImg}">
        <img v-show="!isImg" src="../assets/images/music.png" class="pic paused">
        <div class="info">
          <mu-slider v-model="progress" :display-value="false" @change="changePlayer"></mu-slider>
          <h2>{{ searchInfo.name }}</h2>
          <span>{{ searchInfo.artist.join('、') }}</span>
          <mu-icon v-if="isPlayer"value="pause_circle_outline" @click.stop="setPlay"></mu-icon>
          <mu-icon v-else value="play_circle_outline" @click.stop="setPlay"></mu-icon>
        </div>
      </div>
    </transition>
    <transition name="page">
      <router-view/>
    </transition>
  </mu-container>
</template>

<script>
import axios from 'axios'
export default {
  name: 'index',
  data () {
    return {
      // 搜索的文本
      searchText: '',
      // 搜索的接口
      searchOption: 'netease',
      // 存放搜索到的数据
      searchList: [],
      // 存放当前正在播放的歌曲信息
      searchInfo: {},
      // 标识当前底部播放器是否显示
      showPlayer: false,
      // 标识当前歌曲是否正在播放
      isPlayer: false,
      // 标识当前底部播放器的封面是否加载完成
      isImg: false,
      // 标识列表上拉加载
      loading: false,
      // 标识列表数据是否全部加载完成
      loadAll: false,
      // 标识当前搜索的页面
      page: 1,
      // 标识当前正在播放的歌曲索引
      index: 0,
      // 标识底部进度条
      progress: 0
    }
  },
  methods: {
    load () {
      this.loading = true;
      this.page += 1;
      axios({
        method: 'post',
        url: appConfig.apiUrl + 'api.php',
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        data: 'types=search&count=25&source=' + this.searchOption + '&pages=' + this.page + '&name=' + this.searchText.trim()
      }).then((data) => {
        this.searchList = this.searchList.concat(data.data);
        this.loading = false;
        if (data.data == '') {
          this.loadAll = true;
        }
      })
    },
    search () {
      this.loadAll = false;
      this.page = 1;
      if (this.searchText.trim() != '') {
        this.searchList = [];
        // 获取搜索数据
        axios({
          method: 'post',
          url: appConfig.apiUrl + 'api.php',
          headers: {
            'Content-Type' : 'application/x-www-form-urlencoded'
          },
          data: 'types=search&count=25&source=' + this.searchOption + '&pages=' + this.page + '&name=' + this.searchText.trim()
        }).then((data) => {
          this.searchList = this.searchList.concat(data.data);
        })
      } else {
        plus.nativeUI.toast('请输入要搜索的内容', {
          duration: 'lang'
        });
      }
    },
    getInfo (index) {
      this.searchInfo = {};
      this.$set(this.searchInfo, 'id', this.searchList[index].id);
      this.$set(this.searchInfo, 'url', '');
      this.$set(this.searchInfo, 'name', this.searchList[index].name);
      this.$set(this.searchInfo, 'artist', this.searchList[index].artist);
      this.$set(this.searchInfo, 'duration', '0:00');
      this.$set(this.searchInfo, 'currentTime', '0:00');
      this.showPlayer = true;
      this.isImg = false;
      this.progress = 0;
      this.index = index;
      // 获取歌曲封面
      axios({
        method: 'post',
        url: appConfig.apiUrl + 'api.php',
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        data: 'types=pic&source=' + this.searchList[index].source + '&id=' + this.searchList[index].pic_id
      }).then((data) => {
        this.$set(this.searchInfo, 'pic_url', data.data.url);
      });
      // 获取歌曲url地址
      axios({
        method: 'post',
        url: appConfig.apiUrl + 'api.php',
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        data: 'types=url&source=' + this.searchList[index].source + '&id=' + this.searchList[index].url_id
      }).then((data) => {
        this.$set(this.searchInfo, 'bitrate', data.data.br);
        this.$set(this.searchInfo, 'size', (data.data.size / (1024 * 1024)).toFixed(2));
        this.$set(this.searchInfo, 'url', data.data.url);
      });
      // 获取歌曲歌词
      axios({
        method: 'post',
        url: appConfig.apiUrl + 'api.php',
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        data: 'types=lyric&source=' + this.searchList[index].source + '&id=' + this.searchList[index].lyric_id
      }).then((data) => {
        this.$set(this.searchInfo, 'lyric', data.data.lyric);
      });
      setTimeout(() => {
        this.index = index;
        this.getPlayer();
      }, 0)
    },
    getPlayer () {
      this.isPlayer = true;
      this.$refs.music_player.pause();
      function timeFilter (str) {
        str = Number(str.toFixed(0));
        if (str < 60) {
          if (str < 10) {
            return '0:0' + str.toFixed(0);
          } else {
            return '0:' + str.toFixed(0);
          }
        } else {
          if ((str % 60) < 10) {
            return ((str / 60).toFixed(0) + ':0' + (str % 60));
          } else {
            return ((str / 60).toFixed(0) + ':' + (str % 60));
          }
        }
      }
      var music_player = this.$refs.music_player;
      var music_img = this.$refs.music_img;
      music_img.onload = (() => {
        this.isImg = true;
      });
      music_player.onloadedmetadata = (() => {
        this.$set(this.searchInfo, 'duration', timeFilter(music_player.duration));
        this.progressPlay = setInterval(() => {
          this.$set(this.searchInfo, 'currentTime', timeFilter(music_player.currentTime));
          this.progress = Number(((music_player.currentTime / music_player.duration) * 100).toFixed(2));
          if (music_player.currentTime == music_player.duration) {
            clearInterval(this.progressPlay);
            this.isPlayer = false;
            this.getInfo(this.index + 1);
          }
        }, 1000);
      })
    },
    changePlayer () {
      var music_player = this.$refs.music_player;
      music_player.currentTime = music_player.duration * (this.progress / 100);
      if (music_player.paused) {
        music_player.play();
      }
      if (!this.isPlayer) {
        this.isPlayer = true;
      }
    },
    download (index) {
      function fileNameFilter (str) {
        var text = str.lastIndexOf('/');
        return str.slice(text + 1).split('?')[0].split('#')[0].split('.')[1];
      };
      function createdTips (title, content) {
        plus.nativeUI.alert(content);
        plus.push.createMessage(content, {}, {
          title: title,
          cover: true
        });
      };
      axios({
        method: 'post',
        url: appConfig.apiUrl + 'api.php',
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        data: 'types=url&source=' + this.searchList[index].source + '&id=' + this.searchList[index].url_id
      }).then((data) => {
        var name = this.searchList[index].name + '.' + fileNameFilter(data.data.url);
        if (data.status == 200 && data.statusText == 'OK') {
          createdTips('下载开始。', '歌曲“' + name + '”已开始下载，请稍等。');
          plus.downloader.createDownload(data.data.url, {
            filename: '_downloads/MxuePlayer/' + name,
            timeout: 10,
            retryInterval: 1
          }, (d, status) => {
            if (status == 200) {
              createdTips('下载完成。', '歌曲“' + name + '”下载完成，下载目录为：/downloads/MxuePlayer/');
            } else {
              createdTips('下载失败。', '歌曲“' + name + '”下载失败，错误码为' + status + '，请检查网络或稍后重试。');
            }
          }).start();
        } else {
          createdTips('获取地址失败。', '获取歌曲“' + this.searchList[index].name + '”下载地址失败，请检查网络或稍后重试。');
        }
      });
    },
    setPlay () {
      var music_player = this.$refs.music_player;
      if (this.isPlayer) {
        this.isPlayer = false;
        music_player.pause();
      } else {
        this.isPlayer = true;
        music_player.play();
      }
    },
    playPage () {
      this.$router.push({path: '/play'});
    }
  }
}
</script>

<style>
@import '../assets/css/index.css';
</style>