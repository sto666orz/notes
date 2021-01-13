
/**
 * 检测坐标或区域是否与DOM元素碰撞
 * @param {HTMLElement} el 
 * @param {Number} x 坐标x
 * @param {Number} y 坐标y
 */
export function hitTestBox(el, x, y) {
  const rect = el.getBoundingClientRect();
  return x >= rect.left
      && x <= rect.left + rect.width
      && y >= rect.top
      && y <= rect.top + rect.height;
}

/**
 * 随机整数
 * @param {Number} min 
 * @param {Number} max 
 */
export default function random(min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
}