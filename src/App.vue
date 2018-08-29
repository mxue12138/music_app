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
  background-color: #fff;
}
body, input, ul, li, button {
  margin: 0;
  padding: 0;
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
