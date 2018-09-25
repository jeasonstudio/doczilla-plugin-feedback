// 滚动条在Y轴上的滚动距离
function getScrollTop() {
  let scrollTop = 0,
    bodyScrollTop = 0,
    documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop =
    bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop;
  return scrollTop;
}
// 文档的总高度
function getScrollHeight() {
  let scrollHeight = 0,
    bodyScrollHeight = 0,
    documentScrollHeight = 0;
  if (document.body) {
    bSH = document.body.scrollHeight;
  }
  if (document.documentElement) {
    dSH = document.documentElement.scrollHeight;
  }
  scrollHeight = bSH - dSH > 0 ? bSH : dSH;
  return scrollHeight;
}

// 浏览器窗口的高度
function getWindowHeight() {
  let windowHeight = 0;
  if (document.compatMode == 'CSS1Compat') {
    windowHeight = document.documentElement.clientHeight;
  } else {
    windowHeight = document.body.clientHeight;
  }
  return windowHeight;
}

(function() {
  window.feedbackCache = {};
  if (!document.getElementById('fb-container')) {
    const feedbackElement = document.createElement('div');
    feedbackElement.id = 'fb-container';
    feedbackElement.className = 'fb-container-hide';
    document.body.appendChild(feedbackElement);
  }
  window.markAsRead = function(id) {
    window.feedbackCache[id] = true;
    document.getElementById('fb-container').className = 'fb-container-hide';
  };
  window.markAndOpen = function(id, url) {
    window.markAsRead(id);
    window.open(url);
  };
})();

document.addEventListener('scroll', () => {
  const isShow = getScrollTop() + getWindowHeight() == getScrollHeight();
  const fbElement = document.getElementById('fb-container');
  if (!fbElement) return;
  if (isShow) {
    const filename = (document.getElementById('_fb_filename') || {}).value;

    if (!filename || window.feedbackCache[filename]) return;

    const fileOriginUrl = (document.getElementById('_fb_repo') || {}).value;
    const issueUrl = (document.getElementById('_fb_issue') || {}).value;

    const html = `
    <h4>本文档对你是否有帮助？</h4>
    <div class="fb-options">
      <button class="fb-btn" onclick="markAsRead('${filename}')">&#x1f603;&nbsp;有帮助</button>
      <button class="fb-btn" onclick="markAndOpen('${filename}', '${fileOriginUrl}')">&#x1f64c;&nbsp;协助改进此文档</button>
      <button class="fb-btn" onclick="markAndOpen('${filename}', '${issueUrl}')">&#x1f64b;&nbsp;提交一个 issue</button>
    </div>
    `;

    fbElement.innerHTML = html;
    fbElement.className = 'fb-container-show';
    // console.log(fileOriginUrl, issueUrl);
    // alert(window._feedbacks.filename);
  } else {
    fbElement.innerHTML = '';
    fbElement.className = 'fb-container-hide';
  }
});

// doczilla.on('showArticle', ({ model }) => {
//   console.log('222', model);
//   if (!model.doc) return;
//   window._feedbacks.filename = model.doc.filename;
// });
