/**
 * @fileOverview 右侧轮播日志 - setTimeout 方式实现
 * @author Xue Zhou <zhouxue02@corp.netease.com>
 * @version 0.1
 */

const IIFE = (() => {
  const scrollUpBox = document.getElementById('scrollUpBox');
  const content = document.getElementById('friends-post-list');
  let timer;

/**
 * @description 当日志表单项在div范围内,每执行一次,鼠标向下滑动42px;
 */
  const scrollUp = () => {
    if (scrollUpBox.scrollTop >= (content.clientHeight - scrollUpBox.clientHeight - 10)) {
      scrollUpBox.scrollTop = 0;
    } else {
      scrollUpBox.scrollTop += 42;
      setTimeout(scrollUp, 2000);
    }
  };      

  /**
   * @description 日志表单框被hover时，每2s执行一次scrollUp函数; 移除鼠标时，动效清除。
   */
  timer = setTimeout(scrollUp, 2000);// 间隔2s 执行一次;
  scrollUpBox.onmouseover = () => {
    clearTimeout(timer);
  };
  scrollUpBox.onmouseout = () => {
    timer = setTimeout(scrollUp, 2000);
  };
})(); 

