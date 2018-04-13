   var scrollUpBox = document.getElementById('scrollUpBox');
        var content = document.getElementById('friends-post-list');
        function scrollUp() {
            if (scrollUpBox.scrollTop >= (content.clientHeight - scrollUpBox.clientHeight-10)) {
                scrollUpBox.scrollTop = 0;
                console.log(scrollUpBox.scrollTop,'ch');
            } else {
                scrollUpBox.scrollTop+=42;
                console.log(scrollUpBox.scrollTop,'ch,else');
            }
        }                
        var TIME = 2000;
        var timer = setInterval(scrollUp, TIME);
    
        scrollUpBox.onmouseover = function() {
            clearInterval(timer);
        }
        scrollUpBox.onmouseout = function() {
            timer = setInterval(scrollUp, TIME);
        }