/**
 * @fileOverview 操作当前日志列表相关的函数
 * @author Xue Zhou <zhouxue02@corp.netease.com>
 * @version 0.1
 */

  let { returnedArray,         // 用来储存当前页面上的日志列表
        updateIndex } = util;  // 用来区分发布键用来更新日志或者新建日志

  const { arrayOrganize,
          htmlEscape,
          formatDate } = util; 
   
  /**
   * @description 置顶功能
   * @param {number} index - 当前被点击的post在当前数组中的指数 
   */
  const uppost = (index) => {
    if (returnedArray[index].rank === 5) { // 点的已经为置顶博客，那么下一步为取消置顶。
      returnedArray[index].rank = 0;
      document.getElementById('bloglist').innerHTML = renderList(arrayOrganize(returnedArray));
    } else { // 将当前日志置顶
      for (let j = 0; j < returnedArray.length; j += 1) {
        returnedArray[j].rank = 0;
      } 
      returnedArray[index].rank = 5;
      document.getElementById('bloglist').innerHTML = renderList(arrayOrganize(returnedArray));
      return returnedArray;
    }   
  }; 

  /**
   * @description 删除单篇日志
   * @param {number} index - 当前被点击的post在当前数组中的指数 
   */
  const deletePost = (index) => {
    returnedArray.splice(index, 1);
    document.getElementById('bloglist').innerHTML = renderList(arrayOrganize(returnedArray));
    alert('选中的帖子已被删除');
  };

  /**
   * @description 删除多篇日志
   */
  const getCheckBox = () => {
    const checkBox = document.getElementsByName('checkname[]');
    const checkVal = [];
    for (const k in checkBox) {
      if (checkBox[k].checked) {
        checkVal.push(Number(checkBox[k].id)); // 储存了所有需要删除的指数
      }
    }
    if (checkVal.length === 0) {
      alert('请选择至少一篇日志');
    } else {
      returnedArray = returnedArray.filter((item) => {
        return checkVal.indexOf(item.id) === -1; 
      });
      document.getElementById('bloglist').innerHTML = renderList(arrayOrganize(returnedArray));
      alert('选中的帖子已被删除');
    }
  };

  /**
   * @description 增加/更新一篇日志
   * @param {event} e - 当前激发的默认提交事件。 
   */
  const addPost = (e) => {
    const postTitle = document.getElementById('myFormTitle').value || '';
    const postContent = document.getElementById('myTextarea').value || '';
    const modifyTime = new Date().getTime();

    e.preventDefault();
    if (updateIndex === -1) { // 创建一篇新日志
      if (htmlEscape(postTitle) && htmlEscape(postContent)) { // 所有字段已填入
        returnedArray.push({
          title: htmlEscape(postTitle), 
          blogContent: htmlEscape(postContent),
          modifyTime,
          accessCount: 0,
          allowView: 123,
          commentCount: 32,
          id: 11,
          userId: 100398,
          userName: 'hello',
          userNickname: 'hello',
        });
        document.getElementById('bloglist').innerHTML = renderList(arrayOrganize(returnedArray));
        alert('新日志已建立成功');
      } else {
        alert('标题或内容不能为空！');
      }
    } else if (htmlEscape(postTitle) !== '' && htmlEscape(postContent) !== '') { // 编辑日志
      returnedArray[updateIndex].title = htmlEscape(postTitle);
      returnedArray[updateIndex].blogContent = htmlEscape(postContent);
      document.getElementById('bloglist').innerHTML = renderList(arrayOrganize(returnedArray));
      document.getElementById('myFormTitle').value = '';
      document.getElementById('myTextarea').value = '';
      updateIndex = -1;
      alert('新日志已修改');
    } else {
      alert('标题或正文内容不能为空');
    } 
  };

  /**
   * @description 在表单中呈现日志的现有字段
   * @param {number} i - 被点击的日志在所在数组的指数
   */
  const editPost = (i) => {
    const postTitle = document.getElementById('myFormTitle');
    const postContent = document.getElementById('myTextarea');
    const prevTitle = returnedArray[i].title;
    const prevContent = returnedArray[i].blogContent;
    postTitle.value = prevTitle;
    postContent.value = prevContent;
    updateIndex = i;
  };

  /**
   * @description 将数组渲染成list形式
   * @param {array} arr - 需要渲染的排序后的数组
   * @returns - 返回的html
   */
  const renderList = (arr) => {
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
      returnehtml += '<p>' + formatDate(arr[i].modifyTime) + '&nbsp;&nbsp;&nbsp;阅读' + arr[i].accessCount + '&nbsp;&nbsp;&nbsp;评论' + arr[i].commentCount + '</p>';
      returnehtml += '</div>';
      returnehtml += '</li>';
    } 
    return returnehtml;
  }; 

