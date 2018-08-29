<template>
  <div id="index">
    <div class="text">
      <input type="text" v-model="searchText" @keyup.enter="submit" placeholder="请输入歌曲名称或歌手名称">
      <input type="submit" @click="submit" value="搜索">
    </div>
    <div class="option">
      <label><input type="radio" value="netease" v-model="searchOption">网易</label>
      <label><input type="radio" value="kugou" v-model="searchOption">酷狗</label>
      <label><input type="radio" value="xiami" v-model="searchOption">虾米</label>
      <label><input type="radio" value="tencent" v-model="searchOption">腾讯</label>
      <label><input type="radio" value="baidu" v-model="searchOption">百度</label>
    </div>
    <ul class="list" style="padding: 0 0.625rem;">
      <li v-for="(item, index) in searchList" @click="getInfo(index)" style="padding: 0.25rem;border-bottom: 0.0625rem solid #ddd;position: relative;">
        <div>{{ item.name }}</div>
        <small>{{ item.artist.join('，') }}</small>
        <small v-show="item.album"> -《{{ item.album }}》</small>
      </li>
    </ul>
    <div v-if="showFooter" style="height: 3.75rem;"></div>
    <transition name="footer">
      <div v-if="showFooter" class="footer">
        <img src="" class="pic">

      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'index',
  data () {
    return {
      searchText: '',
      searchOption: 'netease',
      searchList: [],
      searchInfo: {},
      showFooter: false,
      page: 1
    }
  },
  methods: {
    submit () {
      if (this.searchText.trim() != '') {
        this.searchList = '';
        // 获取搜索数据
        axios({
          method: 'post',
          url: appConfig.apiUrl + 'api.php',
          headers: {
            'Content-Type' : 'application/x-www-form-urlencoded'
          },
          data: 'types=search&count=30&source=' + this.searchOption + '&pages=' + this.page + '&name=' + this.searchText.trim()
        }).then((data) => {
          this.searchList = data.data;
        })
      } else {
        alert('请输入要搜索的内容');
      }
    },
    getInfo (index) {
      this.showFooter = true;
      // 获取歌曲url地址
      axios({
        method: 'post',
        url: appConfig.apiUrl + 'api.php',
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        data: 'types=url&source=' + this.searchList[index].source + '&id=' + this.searchList[index].url_id
      }).then((data) => {
        this.searchInfo.size = (data.data.size / (1024 * 1024)).toFixed(2);
        this.searchInfo.url = data.data.url;
      });
      // 获取歌曲封面
      axios({
        method: 'post',
        url: appConfig.apiUrl + 'api.php',
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded'
        },
        data: 'types=pic&source=' + this.searchList[index].source + '&id=' + this.searchList[index].pic_id
      }).then((data) => {
        this.searchInfo.pic_url = data.data.url;
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
        this.searchInfo.lyric = data.data.lyric;
      });
    }
  }
}
</script>

<style>
#index li div {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#index .footer {
  border: 0.0625rem solid #ccc;
  height: 3.75rem;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #ddd;
}
#index .footer-enter-active {
  transition: all .3s ease-in-out;
}
#index .footer-leave-active {
  transition: all .3s ease-in-out;
}
#index .footer-enter, .footer-leave-to {
  transform: translateY(100%);
}
</style>