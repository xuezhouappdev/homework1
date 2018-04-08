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

///////*********************************************************************************************************

//The JS used to deal with ajax and get all the data;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200) {
         var obj = JSON.parse(this.responseText);
        //obj['result'] is the returned array which store the blog details (original array)
         returnedArray = obj['result'];
      }//ajax request ends 
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

//use this funciton to finailize the array order.
function arrayOrganize(arr){
        //1. first step, sort the array by the modifyTime.
        arr = arr.sort(objectArraySort('modifyTime'));
        //2. identify the top first and move it to the first.
        for (var i = 0; i < arr.length; i++) {
          if (arr[i]['rank'] === 5) {
            var removed = arr[i];
            arr.splice(i, 1);
            break;
          }
        }
        arr.unshift(removed); //new array which is ready for render. 

        var liStr = '';
        for(var i = 0; i<arr.length; i++) {
              var index = i;
              liStr +='<li class="bloglist-item" style="display: block;">';
              liStr +='<input type="checkbox" name="checkname[]" value="'+i+'"><span>'+arr[i]['title']+'</span>';
              liStr +='<div class="blog-btn-wrapper">';
              liStr +='<button>编辑</button>';
              liStr +='<div class="dropdown">';
              liStr +='<button class="dropbtn">更多&nbsp;<i class="fas fa-caret-down"></i></button>';
              liStr +='<div class="dropdown-content" >';
              liStr +='<a onclick={deletepost();}>删除</a>';
              liStr +='<a class="up-btn" id="'+ index +'" onclick="uppost('+ index +')">置顶</a>'; //////////////!!!!!!!!!!!!!!!
              liStr +='</div></div></div>';
              liStr +='<div class="blog-meta-wrapper">';
              liStr +='<p>'+formatDate(arr[i]['modifyTime'])+'&nbsp;&nbsp;&nbsp;阅读'+arr[i]['accessCount']+'&nbsp;&nbsp;&nbsp;评论'+arr[i]['commentCount']+'</p>';
              liStr +='</div>';
              liStr +='</li>';
            } //for loop ends here
        document.getElementById('bloglist').innerHTML = liStr;
        //console.log(arr+'from arrayOrganize FUNCTION');
        return arr;
}//arrayOrganize FUNCTION ends here


function arrayOrganize2(arr){
        //1. first step, sort the array by the modifyTime.
        arr = arr.sort(objectArraySort('modifyTime'));
        // //2. identify the top first and move it to the first.
        // for (var i = 0; i < arr.length; i++) {
        //   if (arr[i]['rank'] === 5) {
        //     var removed = arr[i];
        //     arr.splice(i, 1);
        //     break;
        //   }
        // }
        // arr.unshift(removed); //new array which is ready for render. 

        var liStr = '';
        for(var i = 0; i<arr.length; i++) {
              var index = i;
              liStr +='<li class="bloglist-item" style="display: block;">';
              liStr +='<input type="checkbox" name="checkname[]" value="'+i+'"><span>'+arr[i]['title']+'</span>';
              liStr +='<div class="blog-btn-wrapper">';
              liStr +='<button>编辑</button>';
              liStr +='<div class="dropdown">';
              liStr +='<button class="dropbtn">更多&nbsp;<i class="fas fa-caret-down"></i></button>';
              liStr +='<div class="dropdown-content" >';
              liStr +='<a onclick={deletepost();}>删除</a>';
              liStr +='<a class="up-btn" id="'+ index +'" onclick="uppost('+ index +')">置顶</a>'; //////////////!!!!!!!!!!!!!!!
              liStr +='</div></div></div>';
              liStr +='<div class="blog-meta-wrapper">';
              liStr +='<p>'+formatDate(arr[i]['modifyTime'])+'&nbsp;&nbsp;&nbsp;阅读'+arr[i]['accessCount']+'&nbsp;&nbsp;&nbsp;评论'+arr[i]['commentCount']+'</p>';
              liStr +='</div>';
              liStr +='</li>';
            } //for loop ends here
        document.getElementById('bloglist').innerHTML = liStr;
        //console.log(arr+'from arrayOrganize FUNCTION');
        return arr;
}//arrayOrganize FUNCTION ends here




window.onload=function(){
     console.log(returnedArray,'original');
     arrayOrganize(returnedArray);
     console.log(returnedArray);
}


//The script to push the post to the upfirst
var uppost = function(index){
  // alert(index);
  if(returnedArray[index]['rank'] === 5){ //first one already
    returnedArray[index]['rank'] = 1;
    console.log(returnedArray,'new array if untop');
    arrayOrganize2(returnedArray);
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


