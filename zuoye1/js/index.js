var isuntop = false; 
var updateIndex = 999;// 用来区分更新文章 或者 新增一个文章
var isDeleteTop = false;
var returnedArray = [];


// 数组排序并渲染
function arrayOrganize(arr) {
  var liStr = ''; 
  var removed;
  var index; 

  if (arr == null) {
    // return;
  } else {
    arr.sort(objectArraySort('modifyTime'));
    // 2. 找到置顶的post,移到第一个
    if (!isuntop) {
      for (let i = 0; i < arr.length; i += 1) {
        if (arr[i].rank === 5) {
          removed = arr[i];
          arr.splice(i, 1);
          break;
        }
      }
      arr.unshift(removed); // 可以被渲染的数组
    } 
    
    if (isDeleteTop) {
      arr.splice(0, 1);
    } 
    
    for (let i = 0; i < arr.length; i += 1) {
      index = i;
      liStr += '<li class="bloglist-item" style="display: block;">';
      liStr += '<input type="checkbox" name="checkname[]" value="' + i + '" id="' + arr[i].id + '"><span>' + '<i class="fas fa-user private" color="#C50A3C" style="display:' + ((arr[i]['allowView '] === -100) ? 'inline-block' : 'none') + '"></i>' + '&nbsp;' + arr[i].title + ((arr[i].rank === 5) ? '<span style="color:#C50A3C;font-weight:bold">[置顶]</span>' : '') + '</span>';
      liStr += '<div class="blog-btn-wrapper">';
      liStr += '<button onclick="editPost(' + index + ')">编辑</button>';
      liStr += '<div class="dropdown">';
      liStr += '<button class="dropbtn">更多&nbsp;<i class="fas fa-caret-down"></i></button>';
      liStr += '<div class="dropdown-content" >';
      liStr += '<a onclick=deletePost(' + index + ')>删除</a>';
      liStr += '<a class="up-btn" id="' + index + '" onclick="uppost(' + index + ')">置顶</a>'; 
      liStr += '</div></div></div>';
      liStr += '<div class="blog-meta-wrapper">';
      liStr += '<p>' + formatDate(arr[i].modifyTime) + '&nbsp;&nbsp;&nbsp;阅读' + arr[i].accessCount + '&nbsp;&nbsp;&nbsp;评论' + arr[i].commentCount + '</p>';
      liStr += '</div>';
      liStr += '</li>';
    } // for loop ends here
    document.getElementById('bloglist').innerHTML = liStr;
    // console.log(arr+'from arrayOrganize FUNCTION');
    isuntop = false;
    return arr;
  }
}// arrayOrganize FUNCTION ends here

// 置顶日志
function uppost(index) {
  if (returnedArray[index].rank === 5) { // first one already
    returnedArray[index].rank = 1;
    isuntop = true; // this option is to indicate that the action is to untop; 
    console.log(returnedArray, 'new array if untop');
    arrayOrganize(returnedArray);
  } else { // not first one
    for (let j = 0; j < returnedArray.length; j += 1) {
      returnedArray[j].rank = 0;
    } 
    returnedArray[index].rank = 5;
    arrayOrganize(returnedArray);
    console.log(returnedArray, 'new array');
  } 
}

// 删除单篇日志
function deletePost(i) {
  var deletedId = returnedArray[i].id;
  var deleteUrl = addURLParam('http://localhost:8002/api/deleteBlogs', 'id', deletedId);

  fetch(deleteUrl)
    .then(function(response) { 
      return response.json(); 
    })
    .then(function(data) { 
      if (data.message === 'success') {
            alert(data.message + '! The post with ID ' + returnedArray[i].id + ' are successfully deleted.'); 
      }
    }).then(function() {
      arrayOrganize(returnedArray);
    })  
    .catch(function(e) { 
      console.log(e, 'error from fetch'); 
    });
}

// 删除选中的多篇日志
function getCheckBox() {
  var checkBox = document.getElementsByName('checkname[]');
  var urlParameter = 'http://localhost:8002/api/deleteBlogs';
  var check_val = [];

  for (var k in checkBox) {
    if (checkBox[k].checked) {
      check_val.push(checkBox[k].id); // input the post id, while the value stores the index number 
      urlParameter += (urlParameter.indexOf('?') === -1 ? '?' : '&');
      urlParameter += encodeURIComponent('id') + '=' + encodeURIComponent(checkBox[k].id);
      console.log(urlParameter, 'second');
    }    
  }
    if (check_val.length === 0) {
      alert('请选择至少一篇日志');
    } else {
        // Fetch API
      fetch(urlParameter)
      .then(function (response) { 
        return response.json(); 
      })
      .then(function (data) { 
        if (data.message === 'success') {
          alert(data.message + '! 选中的日志已经删除（API Request）'); 
        }
      }).catch(function (e) { 
        console.log(e, 'error from fetch'); 
      });
    }
}

// 创建 or 编辑日志
function addPost(e) {
  var baseUrl = 'http://localhost:8002/api/addBlog';
  var baseEditUrl = 'http://localhost:8002/api/editBlog';
  var postTitle = document.getElementById('myFormTitle').value;
  var postContent = document.getElementById('myTextarea').value;
  var modifyTime = new Date().getTime();
  postTitle = htmlEscape(postTitle);
  postContent = htmlEscape(postContent);

  e.preventDefault();
  if (updateIndex === 999) { // 创建一篇新日志
    if (postTitle && postContent) { // 所有字段已填入
      fetch(baseUrl, {
        method: 'POST',
        body: JSON.stringify({ 
          title: postTitle, 
          blogContent: postContent,
          modifyTime: modifyTime,
          accessCount: 0,
          allowView: 123,
          commentCount: 32,
          id: 11,
          userId: 100398,
          userName: 'hello',
          userNickname: 'hello' }),
      })                  
        .then(function (response) { return response.json(); })
        .then(function (data) {
          console.log(data);
          returnedArray.push(
            { title: postTitle, 
              blogContent: postContent,
              modifyTime: modifyTime,
              accessCount: 0,
              allowView: 123,
              commentCount: 32,
              id: 11,
              userId: 100398,
              userName: 'hello',
              userNickname: 'hello' },
                );
          arrayOrganize(returnedArray);
          console.log(returnedArray);
          alert('新日志已建立成功');
        });
    } else {
        alert('标题或内容不能为空！');
    }
  } else { // 更新一篇日志
    fetch(baseEditUrl, {
      method: 'POST',
      body: JSON.stringify({ 
        title: postTitle, 
        blogContent: postContent,
        modifyTime: new Date().getTime() }), 
    })                  
    .then(function (response) { return response.json(); })
    .then(function(data) {
      console.log(data);
      // console.log(updateIndex,'updated index');
      if (postTitle !== '' && postContent !== '') {
        returnedArray[updateIndex].title = postTitle;
        returnedArray[updateIndex].blogContent = postContent;
        arrayOrganize(returnedArray);
        updateIndex = 999;
        document.getElementById('myFormTitle').value = '';
        document.getElementById('myTextarea').value = '';
        alert('新日志已修改');
      } else {
        alert('标题或正文内容不能为空');
      } 
    });
  }
}

// 呈现已有日志
function editPost(i) {
  // alert('test');
  var postTitle = document.getElementById('myFormTitle');
  var postContent = document.getElementById('myTextarea');
  var prevTitle = returnedArray[i].title;
  var prevContent = returnedArray[i].blogContent;
  postTitle.value = prevTitle;
  postContent.value = prevContent; 
  updateIndex = i;
  console.log(updateIndex);
}

returnedArray = arrayOrganize(getData('postArrString'));
console.log(returnedArray, 'new array');
document.getElementById('all').addEventListener('click', checkAll);
document.getElementById('defaultOpen').click();
document.getElementById('addPost').addEventListener('submit', addPost);

// 页面第一次加载时load数据
window.onload = function() {
    // The AJAX to get all the data;
  var xhttp = createXHR();
  var obj;
  var JSONready;

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      obj = JSON.parse(this.responseText);
      // obj['result'] is the returned array which store the blog details (original array)
      console.log(obj.result, 'original source');
      JSONready = JSON.stringify(obj.result);
      // set localstorage
      localStorage.setItem('postArrString', JSONready); 
      console.log('AJAX request was success');
    } else {
      console.log('Request was unsuccessful: ' + xhttp.status + ' ' + xhttp.readyState);
    }
  };
  xhttp.open('GET', 'http://localhost:8002/api/getBlogs', true);
  xhttp.send();  
};
