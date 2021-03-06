/**
 * 进入局部全屏
 * @param {HTMLDivElement} screen 
 * @returns {Boolean} 是否支持
 */
export function requestFullscreen(screen) {
  if (screen.requestFullscreen) {
    screen.requestFullscreen();
  } else if (screen.webkitRequestFullScreen) {
    screen.webkitRequestFullScreen();
  } else if (screen.mozRequestFullScreen) {
    screen.mozRequestFullScreen();
  } else {
    return false;
  }
  return true;
}

/**
 * 退出全屏
 * @returns {Boolean} 是否支持
 */
export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else {
    return false
  }
  return true;
}