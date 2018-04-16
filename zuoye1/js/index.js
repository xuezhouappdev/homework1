/**
 * @fileOverview 操作当前日志列表相关的函数
 * @author Xue Zhou <zhouxue02@corp.netease.com>
 * @version 0.1
 */

let returnedArray = util.returnedArray;// 用来储存当前页面上的日志列表
let updateIndex = util.updateIndex; // 用来区分发布键用来更新日志或者新建日志

/**
 * @description 置顶功能
 * @param {number} index - 当前被点击的post在当前数组中的指数 
 */
const uppost = (index) => {
  if (returnedArray[index].rank === 5) { // 点的已经为置顶博客，那么下一步为取消置顶。
    returnedArray[index].rank = 0;
    document.getElementById('bloglist').innerHTML = util.renderList(util.arrayOrganize(returnedArray));
  } else { // 将当前日志置顶
    for (let j = 0; j < returnedArray.length; j += 1) {
      returnedArray[j].rank = 0;
    } 
    returnedArray[index].rank = 5;
    document.getElementById('bloglist').innerHTML = util.renderList(util.arrayOrganize(returnedArray));
    return returnedArray;
  }   
}; 

/**
 * @description 删除单篇日志
 * @param {number} index - 当前被点击的post在当前数组中的指数 
 */
const deletePost = (index) => {
  returnedArray.splice(index, 1);
  document.getElementById('bloglist').innerHTML = util.renderList(util.arrayOrganize(returnedArray));
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
    document.getElementById('bloglist').innerHTML = util.renderList(util.arrayOrganize(returnedArray));
    alert('选中的帖子已被删除');
  }
};

/**
 * @description 增加/更新一篇日志
 * @param {event} e - 当前激发的默认提交事件。 
 */
const addPost = (e) => {
  let postTitle = document.getElementById('myFormTitle').value || '';
  let postContent = document.getElementById('myTextarea').value || '';
  const modifyTime = new Date().getTime();

  e.preventDefault();
  if (updateIndex === -1) { // 创建一篇新日志
    if (util.htmlEscape(postTitle) && util.htmlEscape(postContent)) { // 所有字段已填入
      returnedArray.push({
        title: util.htmlEscape(postTitle), 
        blogContent: util.htmlEscape(postContent),
        modifyTime: modifyTime,
        accessCount: 0,
        allowView: 123,
        commentCount: 32,
        id: 11,
        userId: 100398,
        userName: 'hello',
        userNickname: 'hello',
      });
      document.getElementById('bloglist').innerHTML = util.renderList(util.arrayOrganize(returnedArray));
      alert('新日志已建立成功');
    } else {
      alert('标题或内容不能为空！');
    }
  } else { // 更新一篇日志
    if (util.htmlEscape(postTitle) !== '' && util.htmlEscape(postContent) !== '') {
      returnedArray[updateIndex].title = util.htmlEscape(postTitle);
      returnedArray[updateIndex].blogContent = util.htmlEscape(postContent);
      document.getElementById('bloglist').innerHTML = util.renderList(util.arrayOrganize(returnedArray));
      document.getElementById('myFormTitle').value = '';
      document.getElementById('myTextarea').value = '';
      updateIndex = 999;
      alert('新日志已修改');
    } else {
      alert('标题或正文内容不能为空');
    } 
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
