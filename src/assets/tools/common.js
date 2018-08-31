global.appConfig = {
  apiUrl : 'https://music.itmxue.cn/'
};
document.addEventListener('plusready', () => {
  function fileNameFilter(str) {
    var text = str.lastIndexOf('/');
    return str.slice(text + 1).split('?')[0];
  };
  var webview = plus.webview.currentWebview();
  plus.key.addEventListener('backbutton', () => {
    webview.canBack((e) => {
      if(e.canBack) {
        webview.back();
      } else {
        if(confirm('是否确认退出')) {
          plus.runtime.quit();
        } else {
          return
        }
      }
    })
  })
})