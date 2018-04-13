// 控制tab
function openTab(evt, tabName) {
  var i, 
    tabcontent, 
    tablinks;
  tabcontent = document.getElementsByClassName('tabcontent');
  for (i = 0; i < tabcontent.length; i += 1) {
    tabcontent[i].style.display = 'none';
  }
  tablinks = document.getElementsByClassName('tablinks');
  for (i = 0; i < tablinks.length; i += 1) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }
  document.getElementById(tabName).style.display = 'block';
  evt.currentTarget.className += ' active';
}

// 根据一个属性将对象数组排序
function objectArraySort (keyName) {
  return function (objectN, objectM) {
    var valueN = objectN[keyName];
    var valueM = objectM[keyName];
    if (valueN < valueM) return 1;
    else if (valueN > valueM) return -1;
    else return 0; 
  };
}

// 全选框
function checkAll () {  
  var all = document.getElementById('all');  
  var one = document.getElementsByName('checkname[]');
  for (var i = 0; i < one.length; i += 1) {  
    one[i].checked = all.checked;              
  }  
} 

// 转化时间戳 
function formatDate (date) {
  var date = new Date(date);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  var h = date.getHours();
  var m1 = date.getMinutes();
  var s = date.getSeconds();
  var m = m < 10 ? ('0' + m) : m;
  d = d < 10 ? ('0' + d) : d;
  return y + '-' + m + '-' + d + '-' + h + ':' + m1 + ':' + s;
}

// url传参
function addURLParam (url, name, value) {
  url += (url.indexOf('?') === -1 ? '?' : '&');
  url += encodeURIComponent(name) + '=' + encodeURIComponent(value);
  return url;
}

// 从localstorage 中载入来自API的原数据
function getData(key) {
  return JSON.parse(localStorage.getItem(key));
}

// AJAX  - IE 7以下兼容性 
function createXHR() {
  var versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'],
    i, 
    len;    
  if (typeof XMLHttpRequest !== 'undefined') {
    return new XMLHttpRequest();
  } else if (typeof ActiveXObject !== 'undefined') {
    if (typeof arguments.callee.activeXString !== 'string') {
       
      for (i = 0, len = versions.length; i < len; i += 1) {
        try {
          new ActiveXObject(versions[i]);
          arguments.callee.activeXString = versions[i];
          break;
        } catch (ex) {
          return ex;
        }
      }           
    }
    return new ActiveXObject(arguments.callee.activeXString);
  } else {
    throw new Error('No XHR object available.');
  }
}

 // 表单提交，内容转义
function htmlEscape(text) { 
  return text.replace(/[<>"&'\/]/g, function (match, pos, originalText) {
      switch (match) {
        case '<': return '&lt;'; 
        case '>':return '&gt;';
        case '&':return '&amp;'; 
        case '\"':return '&quot;'; 
        case '\'': return '&#x27;';
        case '/':return '&#x2F;'; 
      } 
  });
}
