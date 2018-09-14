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
    <div class="list" :class="{ bottom: showPlayer && searchList }">
      <mu-load-more :refreshing="refreshing" @refresh="refresh" :loading="loading" @load="load" :loaded-all="loadAll">
        <mu-list :dense="true">
          <template v-for="(item, index) in searchList">
             <mu-list-item avatar :ripple="false" button @click="getInfo(index)">
              <mu-list-item-content>
                <mu-list-item-title>{{ item.name }}</mu-list-item-title>
                <mu-list-item-sub-title>
                  {{ item.artist.join('、') }}
                  <span v-if="item.album">&nbsp;-&nbsp;《{{ item.album }}》</span>
                </mu-list-item-sub-title>
              </mu-list-item-content>
              <mu-list-item-action @click.stop="getInfo(index)">
                <mu-icon v-if="item.id == palyerInfo.id && isPlayer" value="pause_circle_outline"></mu-icon>
                <mu-icon v-else value="play_circle_outline"></mu-icon>
              </mu-list-item-action>
              <mu-list-item-action @click.stop="download(index)">
                <mu-icon value="arrow_downward"></mu-icon>
              </mu-list-item-action>
            </mu-list-item>
            <mu-divider></mu-divider>
          </template>
        </mu-list>
      </mu-load-more>
    </div>
    <transition name="palyer">
      <div v-if="showPlayer" class="palyer" @click="playPage">
        <audio :src="palyerInfo.url" autoplay ref="music_player"></audio>
        <img ref="music_img" v-show="palyerInfo.pic_url && isImg" :src="palyerInfo.pic_url" class="pic" :class="{ paused: !isPlayer && isImg}">
        <img v-show="!isImg" src="../assets/images/music.png" class="pic paused">
        <div class="info">
          <mu-slider v-model="progress" :display-value="false" @change="changePlayer"></mu-slider>
          <div>
            <h2>{{ palyerInfo.name }}</h2>
            <span>{{ palyerInfo.artist.join('、') }}</span>
            <div class="icon-box">
              <mu-icon value="skip_previous" @click.stop="prevPlay"></mu-icon>
              <mu-icon v-if="isPlayer" value="pause_circle_outline" @click.stop="setPlay"></mu-icon>
              <mu-icon v-else value="play_circle_outline" @click.stop="setPlay"></mu-icon>
              <mu-icon value="skip_next" @click.stop="nextPlay"></mu-icon>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="page">
      <play v-if="showPlayPage"></play>
    </transition>
  </mu-container>
</template>

<script>
import index from '../assets/js/index.js'
export default index
</script>

<style>
@import '../assets/css/index.css';
</style>