var isuntop = false; 
var updateIndex = 999;// 用来区分发布按钮做更新操作 or 

//The JS used to control the tabs
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();

//The JS used to control select all checkbox
function checkAll() {  
                  var all=document.getElementById('all');  
                  var one=document.getElementsByName('checkname[]');
                  for(var i=0;i<one.length;i++){  
                     one[i].checked=all.checked; 
                  }  
} 
var all=document.getElementById('all');
all.onclick=function(){
   checkAll();
}

//The JS used to convert time to standard time. 
function formatDate(date){
        date = new Date(date);
        var y=date.getFullYear();
        var m=date.getMonth()+1;
        var d=date.getDate();
        var h=date.getHours();
        var m1=date.getMinutes();
        var s=date.getSeconds();
        m = m<10?("0"+m):m;
        d = d<10?("0"+d):d;
        return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
}

//The JS to deal with the compatibility of localStorage
function getLocalStorage(){
        if (typeof localStorage == "object"){
            return localStorage;
        } else if (typeof globalStorage == "object"){
            return globalStorage[location.host];
        } else {
            throw new Error("Local storage not available.");
        }
}
///////*********************************************************************************************************

//The script to deal with the IE7- 
function createXHR(){
        if (typeof XMLHttpRequest != "undefined"){
            return new XMLHttpRequest();
        } else if (typeof ActiveXObject != "undefined"){
           if (typeof arguments.callee.activeXString != "string"){
               var versions = [ "MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],i, len;
           for (i=0,len=versions.length; i < len; i++){
               try {
                   new ActiveXObject(versions[i]);
                   arguments.callee.activeXString = versions[i];
                   break;
        } catch (ex){
          }
          }           
          }
       return new ActiveXObject(arguments.callee.activeXString);
} else {
        throw new Error("No XHR object available.");
  }
}

//The JS used to add parameters after the url
function addURLParam(url, name, value) {
        url += (url.indexOf("?") == -1 ? "?" : "&");
        url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
        return url;
}

//The AJAX to get all the data;
var xhttp = createXHR();
  xhttp.onreadystatechange = function() {
      if(xhttp.readyState == 4 && xhttp.status == 200) {
         var obj = JSON.parse(this.responseText);
        //obj['result'] is the returned array which store the blog details (original array)
         returnedArray = obj['result'];
      }//ajax request ends 
      else {
         console.log("Request was unsuccessful: " + xhttp.status);
      }
  };
xhttp.open("GET", "http://localhost:8002/api/getBlogs", true);
xhttp.send();

//The JS used to sort the arrays based on a property
function objectArraySort(keyName) {
         return function (objectN, objectM) {
          var valueN = objectN[keyName]
          var valueM = objectM[keyName]
          if (valueN < valueM) return 1
          else if (valueN > valueM) return -1
          else return 0 }
}

//数组排序
function arrayOrganize(arr){
        //1. 根据 modifyTime 排序
        arr = arr.sort(objectArraySort('modifyTime'));
        //2. 找到置顶的post,移到第一个
        if(!isuntop){
          for (var i = 0; i < arr.length; i++) {
            if (arr[i]['rank'] === 5) {
              var removed = arr[i];
              arr.splice(i, 1);
              break;
            }
          }
          arr.unshift(removed); //可以被渲染的数组
        }
        var liStr = '';
        for(var i = 0; i<arr.length; i++) {
              var index = i;
              liStr +='<li class="bloglist-item" style="display: block;">';
              liStr +='<input type="checkbox" name="checkname[]" value="'+i+'" id="'+arr[i]['id']+'"><span>'+'<i class="fas fa-user private" color="#C50A3C" style="display:'+((arr[i]['allowView ']==-100) ? 'inline-block':'none')+'"></i>'+'&nbsp;'+arr[i]['title'] + ((arr[i]['rank']==5) ? '<span style="color:#C50A3C;font-weight:bold">[置顶]</span>':'')+ '</span>';
              liStr +='<div class="blog-btn-wrapper">';
              liStr +='<button onclick="editPost('+ index + ')">编辑</button>';
              liStr +='<div class="dropdown">';
              liStr +='<button class="dropbtn">更多&nbsp;<i class="fas fa-caret-down"></i></button>';
              liStr +='<div class="dropdown-content" >';
              liStr +='<a onclick=deletePost('+ index +')>删除</a>';
              liStr +='<a class="up-btn" id="'+ index +'" onclick="uppost('+ index +')">置顶</a>'; 
              liStr +='</div></div></div>';
              liStr +='<div class="blog-meta-wrapper">';
              liStr +='<p>'+formatDate(arr[i]['modifyTime'])+'&nbsp;&nbsp;&nbsp;阅读'+arr[i]['accessCount']+'&nbsp;&nbsp;&nbsp;评论'+arr[i]['commentCount']+'</p>';
              liStr +='</div>';
              liStr +='</li>';
            } //for loop ends here
        document.getElementById('bloglist').innerHTML = liStr;
        //console.log(arr+'from arrayOrganize FUNCTION');
        isuntop = false;
        return arr;
}//arrayOrganize FUNCTION ends here

//置顶日志
function uppost(index) {
  if(returnedArray[index]['rank'] === 5){ //first one already
    returnedArray[index]['rank'] = 1;
    isuntop = true; //this option is to indicate that the action is to untop; 
    console.log(returnedArray,'new array if untop');
    arrayOrganize(returnedArray);
  }
  else{ //not first one
    for (var j = 0; j < returnedArray.length; j++) {
      returnedArray[j]['rank']= 0;
    } 
      returnedArray[index]['rank'] = 5;
      arrayOrganize(returnedArray);
      console.log(returnedArray,'new array');
  } 
}

function deletePost(i) {
    var deletedId = returnedArray[i]['id'];
    var deleteUrl = addURLParam('http://localhost:8002/api/deleteBlogs','id',deletedId);
    fetch(deleteUrl)
    .then(function(response){ 
        return response.json(); 
       })
    .then(function(data){ 
        if(data.message == 'success'){
            alert(data.message+'! The post with ID ' + returnedArray[i]['id'] + ' are successfully deleted.'); 
        }
    }).catch(function(e){ 
        console.log("error from fetch"); 
    })
}

//删除选中的日志
function getCheckBox(){
    check_box = document.getElementsByName("checkname[]");
    urlParameter = 'http://localhost:8002/api/deleteBlogs';
    check_val = [];
    for(k in check_box){
        if(check_box[k].checked){
            check_val.push(check_box[k].id); //input the post id, while the value stores the index number 
            urlParameter += (urlParameter.indexOf("?") == -1 ? "?" : "&");
            urlParameter += encodeURIComponent('id') + '=' + encodeURIComponent(check_box[k].id);
            console.log(urlParameter,'second');
        }    
    }
    if(check_val.length == 0){
        alert('请选择至少一篇日志');
    }
    else{
        //Fetch API
        fetch(urlParameter)
        .then(function(response){ 
            return response.json(); 
           })
        .then(function(data){ 
            if(data.message == 'success'){
                alert(data.message+'! 选中的日志已经删除（API Request）'); 
            }
        }).catch(function(e){ 
            console.log("error from fetch"); 
        })
    }
}
document.getElementById('addPost').addEventListener("submit",addPost);

//创建 or 编辑日志
function addPost(e){
  e.preventDefault();
  var postTitle = document.getElementById('myFormTitle').value;
  console.log(postTitle);
  var postContent = document.getElementById('myTextarea').value;
  console.log(postContent);

  if( updateIndex == 999 ) { //创建一篇新日志
    var baseUrl = 'http://localhost:8002/api/addBlog';
    if(postTitle && postContent){//所有字段已填入
            fetch(baseUrl, {
                method:'POST',
                // headers: {
                //     'Accept': 'application/json, text/plain, */*',
                //     'Content-type':'application/json'
                // },
                body: JSON.stringify({title:postTitle, 
                                    blogContent:postContent,
                                    modifyTime:123,
                                    accessCount:123,
                                    allowView:123,
                                    commentCount:32323,
                                    id:11,
                                    userId:100398,
                                    userName:"hello",
                                    userNickname: "hello"})
            })                  
            .then(function(response){ return response.json()})
            .then(function(data){console.log(data);})
            .then( alert('新日志已建立成功'));
    }
    else {
        alert('标题或内容不能为空！');
    }
  }
  else { // 更新一篇日志
    var baseUrl = 'http://localhost:8002/api/editBlog';
    fetch(baseUrl, {
        method:'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type':'application/json'
        },
        body: JSON.stringify({title:postTitle, 
                            blogContent:postContent,
                            modifyTime:new Date().getTime()})
    })                  
    .then(function(response){ return response.json()})
    .then(function(data){
        console.log(data);
        // console.log(updateIndex,'updated index');
        if(postTitle !=='' && postContent !==''){
            returnedArray[updateIndex]['title'] = postTitle;
            returnedArray[updateIndex]['blogContent'] = postContent;
            arrayOrganize(returnedArray);
            updateIndex = 999;
            document.getElementById('myFormTitle').value = '';
            document.getElementById('myTextarea').value = '';
            alert('新日志已修改');
        }
        else{
            alert('标题或正文内容不能为空');
        }
        
    });
  }
}

//编辑日志 - 第一步
function editPost(i){
  //alert('test');
  var postTitle = document.getElementById('myFormTitle')
  var postContent = document.getElementById('myTextarea')
  
  var prevTitle = returnedArray[i]['title'];
  var prevContent = returnedArray[i]['blogContent'];
  var prevModifyTime = returnedArray[i]['modifyTime'];

  postTitle.value = prevTitle;
  postContent.value = prevContent; 
  
  updateIndex = i;
  console.log(updateIndex);
  var baseEditUrl = 'http://localhost:8002/api/editBlog'; 
}

//页面加载时load数据
window.onload=function(){
     console.log(returnedArray,'original');
     arrayOrganize(returnedArray);
     console.log(returnedArray);
}

// document.getElementById('delete-m-btn').onclick = function(){
//   alert('test');
// }