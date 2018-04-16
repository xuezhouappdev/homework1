/**
 * @fileOverview 工具函数
 * @author Xue Zhou <zhouxue02@corp.netease.com>
 * @version 0.1
 */

/**
 * @description 声明一个对象储存工具函数以及全局变量;
 */
const util = { 
  /**
   * @description 控制tab
   * @param {event} evt - 当前事件.
   * @param {string} tabName - 切换板块的名称
   */
  openTab: (evt, tabName) => {
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i += 1) {
      tabcontent[i].style.display = 'none';
    }
    const tablinks = document.getElementsByClassName('tablinks');
    for (let i = 0; i < tablinks.length; i += 1) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';
  },
 
  /**
   * @description 根据一个属性将对象数组排序
   * @param {string} keyName - 需要比较的属性
   * @returns {number} - 结果 
   */
  objectArraySort: (keyName) => {
    return (objectN, objectM) => {
      const valueN = objectN[keyName];
      const valueM = objectM[keyName];
      if (valueN < valueM) return 1;
      else if (valueN > valueM) return -1;
      else return 0; 
    };
  },

  /**
   * @description 实现全选框功能
   */
  checkAll: () => {
    const all = document.getElementById('all');  
    const one = document.getElementsByName('checkname[]');
    for (let i = 0; i < one.length; i += 1) {  
      one[i].checked = all.checked;              
    } 
  },

  /**
   * @description 转化时间戳
   * @param {number} inputDate - Unix时间戳
   * @returns {string} - 与时间戳对应的标准时间格式 
   */
  formatDate: (inputDate) => {
    const date = new Date(inputDate);
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    const h = date.getHours();
    const m1 = date.getMinutes();
    const s = date.getSeconds();
    m = m < 10 ? (`0${m}`) : m;
    d = d < 10 ? (`0${d}`) : d;
    // return y + '-' + m + '-' + d + '-' + h + ':' + m1 + ':' + s;
    return `${y}-${m}-${d}-${h}:${m1}:${s}`;
  },

  /**
   * @description 单个参数传参
   * @param {string} inputUrl - 需要被传参的url
   * @param {string} name - 被传入的key
   * @param {string} value - 被传入的value
   * @returns {string} - 传参后的url
   */
  addURLParam: (inputUrl, name, value) => {
    let url = inputUrl || '';
    url += (inputUrl.indexOf('?') === -1 ? '?' : '&');
    url += `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    return url;
  },

  /**
   * @description 表单提交时对input内容进行放xss转义
   * @param {string} text - 用户提交的原字符串
   * @returns {string} - 转义后的字符串
   */
  htmlEscape: (text) => { 
    return text.replace(/[<>"&'\/]/g, (match, pos, originalText) => {
      switch (match) {
        case '<': return '&lt;'; 
        case '>':return '&gt;';
        case '&':return '&amp;'; 
        case '\"':return '&quot;'; 
        case '\'': return '&#x27;';
        case '/':return '&#x2F;'; 
        default: return '';
      } 
    });
  },
  
  /**
   * @description 处理ajax请求
   */
  ajax: {
    /**
     * @description GET 请求
     * @param {string} url 服务器文件地址
     * @param {object} fn 回调函数
     * @returns 返回的原始对象数组
     */
    get: (url, fn) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
          // fn.call(this, xhr.responseText);
          fn.call(this, (JSON.parse(xhr.responseText)).result);
        } else {
          console.log(`Request was unsuccessful:${xhr.status}`);
        }
      };
      xhr.send();
    },

    /**
     * @description POST 请求
     * @param {string} url 服务器文件地址
     * @param {string} data 传入的数据
     * @param {object} fn 请求成功时callback
     */
    post: (url, data, fn) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {  
          fn.call(this, xhr.responseText);
        } else {
          alert(`Request was unsuccessful:${xhr.status}`);
        }
      };
      xhr.send(data);
    },
  },
  
  /**
   * @description 判断对象数组中某一项有没有置顶项
   * @param {object} item - 对象数组中的一项
   * @returns 返回true or false;
   */
  hasTop: (item) => {
    return item.rank === 5;
  },
  
  /**
   * @description 将传入的对象数组按照时间属性排序，并将置顶日志放在最前面
   * @param {array} arr - 需要排序的原数组
   * @param {string} prop - 需要排序的属性
   * @returns - 排序后的数组
   */
  arrayOrganize: (arr) => {
    let removed;
    const hasTop = arr.some(util.hasTop);
    if (arr.length === 0) {
      return;
    } else {
      arr.sort(util.objectArraySort('modifyTime')); // 按照时间排序
      if (hasTop) { // 如果有置顶项
        for (let i = 0; i < arr.length; i += 1) {
          if (arr[i].rank === 5) {
            removed = arr[i];
            arr.splice(i, 1);
            break;
          }
        }
        arr.unshift(removed);
      }  
    }
    return arr;
  },

  /**
   * @description 将数组渲染成list形式
   * @param {array} arr - 需要渲染的排序后的数组
   * @returns - 返回的html
   */
  renderList: (arr) => {
    let returnehtml = '';
    if (!arr) {
      return '<li><p>当前没有日志</p></li>';
    }
    for (let i = 0; i < arr.length; i += 1) {
      returnehtml += '<li class="bloglist-item" style="display: block;">';
      returnehtml += '<input type="checkbox" name="checkname[]" value="' + i + '" id="' + arr[i].id + '"><span><i class="fas fa-user private" color="#C50A3C" style="display:' + ((arr[i]['allowView '] === -100) ? 'inline-block' : 'none') + '"></i>&nbsp;' + arr[i].title + ((arr[i].rank === 5) ? '<span style="color:#C50A3C;font-weight:bold">[置顶]</span>' : '') + '</span>';
      returnehtml += '<div class="blog-btn-wrapper">';
      returnehtml += '<button onclick="editPost(' + i + ')">编辑</button>';
      returnehtml += '<div class="dropdown">';
      returnehtml += '<button class="dropbtn">更多&nbsp;<i class="fas fa-caret-down"></i></button>';
      returnehtml += '<div class="dropdown-content" >';
      returnehtml += '<a onclick=deletePost(' + i + ')>删除</a>';
      returnehtml += '<a class="up-btn" id="' + i + '" onclick="uppost(' + i + ')">置顶</a>'; 
      returnehtml += '</div></div></div>';
      returnehtml += '<div class="blog-meta-wrapper">';
      returnehtml += '<p>' + util.formatDate(arr[i].modifyTime) + '&nbsp;&nbsp;&nbsp;阅读' + arr[i].accessCount + '&nbsp;&nbsp;&nbsp;评论' + arr[i].commentCount + '</p>';
      returnehtml += '</div>';
      returnehtml += '</li>';
    } 
    return returnehtml;
  },
  updateIndex: -1,
  returnedArray: [],
};
