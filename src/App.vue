<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 1;
  background-color: #fff;
  height: 100%;
  width: 100%;
}
.clearfix::after, .clearfix::before {
  content: '';
  display: block;
  height: 0;
  width: 0;
  overflow: hidden;
  clear: both;
  visibility: hidden;
}
body {
  user-select: none;
  line-height: 1.2 !important;
  background-color: #fff;
}
body, input, ul, li, button, h1, h2, h3, h4, h5, h6 {
  margin: 0;
  padding: 0;
}
h1, h2, h3, h4, h5, h6 {
  font-weight: normal;
}
ul, li {
  list-style: none;
}
input {
  background-color: transparent;
  outline: none;
  border: none;
}
</style>
