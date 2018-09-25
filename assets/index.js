// 滚动条在Y轴上的滚动距离
function getScrollTop() {
  var bodyScrollTop = 0;
  var documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  return bodyScrollTop - documentScrollTop > 0
    ? bodyScrollTop
    : documentScrollTop;
}
// 文档的总高度
function getScrollHeight() {
  // var scrollHeight = 0;
  // var bodyScrollHeight = 0;
  // var documentScrollHeight = 0;
  var bSH, dSH;

  if (document.body) {
    bSH = document.body.scrollHeight;
  }
  if (document.documentElement) {
    dSH = document.documentElement.scrollHeight;
  }
  return bSH - dSH > 0 ? bSH : dSH;
}

// 浏览器窗口的高度
function getWindowHeight() {
  return document.compatMode === 'CSS1Compat'
    ? document.documentElement.clientHeight
    : document.body.clientHeight;
}

(function() {
  window._feedbackCache = {};
  window._feedbackOpts =
    doczilla.getPlugin('doczilla-plugin-feedback').options || {};
  doczilla.on('showArticle', function(opt) {
    window._feedbackOpts.filename = opt.model.doc.filename;
  });

  document.addEventListener('scroll', () => {
    var isShow = getScrollTop() + getWindowHeight() == getScrollHeight();
    if (!window._feedbackElement) return;
    if (isShow) {
      var filename = window._feedbackOpts.filename;
      var repo = window._feedbackOpts.repo;
      var issue = window._feedbackOpts.issue;
      if (!filename || window._feedbackCache[filename]) return;

      window._fbShow(`
      <h4>本文档对你是否有帮助？</h4>
      <div class="fb-options">
        <button class="fb-btn" onclick="_markAsRead('${filename}')">&#x1f603;&nbsp;有帮助</button>
        ${
          filename && repo
            ? `<button class="fb-btn" onclick="_markAndOpen('${filename}', '${repo.replace(
                /{{filename}}/gi,
                filename
              )}')">&#x1f64c;&nbsp;协助改进此文档</button>`
            : ''
        }
        ${issue ? `<button class="fb-btn" onclick="_markAndOpen('${filename}', '${issue}')">&#x1f64b;&nbsp;提交一个 issue</button>` : ''}
        ${!repo && !issue ? `<button class="fb-btn" onclick="_markAsRead('${filename}')">&#x1f623;&nbsp;没有帮助</button>` : ''}
      </div>
      `);
    } else {
      window._fbHide();
    }
  });

  if (!window._feedbackElement) {
    window._feedbackElement = document.createElement('div');
    window._feedbackElement.id = 'fb-container';
    window._feedbackElement.className = 'fb-container-hide';
    document.body.appendChild(_feedbackElement);
  }
  window._markAsRead = function(id) {
    window._feedbackCache[id] = true;
    window._feedbackElement.className = 'fb-container-hide';
  };
  window._markAndOpen = function(id, url) {
    window._markAsRead(id);
    window.open(url);
  };
  window._fbShow = function(html) {
    window._feedbackElement.innerHTML = html;
    window._feedbackElement.className = 'fb-container-show';
  };
  window._fbHide = function() {
    // window._feedbackElement.innerHTML = '';
    window._feedbackElement.className = 'fb-container-hide';
  };
})();
